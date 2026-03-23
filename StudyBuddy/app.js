/**
 * STUDY BUDDY — Frontend-only demo using Gemini API (REST) for text + image Q&A
 * Security note: This demo calls the Gemini API directly from the browser.
 * For production, proxy the request via a backend to protect your API key.
 */

// ==== DOM refs (declare ONCE) ====
const chatEl   = document.getElementById('chat');
const API_KEY  = "AIzaSyBQ_cjcs6tSggOv6a9GUkbh7YC7O5yhMhI"; // ⚠️ Embedded for local demo only
const askBtn   = document.getElementById('ask');
const promptEl = document.getElementById('prompt');
const imageInp = document.getElementById('imageInput');
const modelEl  = document.getElementById('model');
const clearBtn = document.getElementById('clearChat');
const warnEl   = document.getElementById('warn');
const runDiag  = document.getElementById('runDiag');

// ==== Settings persistence ====
modelEl.value  = localStorage.getItem('GEMINI_MODEL') || 'gemini-2.5-flash';
modelEl.onchange = () => localStorage.setItem('GEMINI_MODEL', modelEl.value);

// ==== UI helpers ====
clearBtn.onclick = () => { chatEl.innerHTML=''; toast('Chat cleared'); };
function toast(msg){ warnEl.textContent = msg; setTimeout(()=> warnEl.textContent='', 1800); }

// ==== Chat helpers ====
function addMessage(role, html){
  const wrap = document.createElement('div');
  wrap.className = `msg ${role}`;
  wrap.innerHTML = `
    <div class="avatar">${role==='ai' ? 'G' : 'U'}</div>
    <div class="bubble">
      <div class="name">${role==='ai' ? 'Study Buddy' : 'You'}</div>
      <div class="body">${html}</div>
    </div>`;
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
  return wrap.querySelector('.body');
}

function escapeHtml(s){
  return s.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;','\'':'&#39;'}[c]));
}

// Convert File -> { inline_data: { mime_type, data } }
function fileToInlinePart(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve({ inline_data: { mime_type: file.type || 'image/*', data: base64 } });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Render image previews under the last user bubble
function renderPreviews(files, containerEl){
  [...files].forEach(f=>{
    const r = new FileReader();
    r.onload = () => {
      const img = document.createElement('img');
      img.src = r.result; img.className='preview';
      containerEl.appendChild(img);
    };
    r.readAsDataURL(f);
  });
}

// Core call using REST generateContent
async function generateContent({apiKey, model, text, imageFiles}){
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const parts = [];
  // Add images first so the final text can reference "this image".
  for (const f of imageFiles){
    const part = await fileToInlinePart(f);
    parts.push(part);
  }
  if (text && text.trim()) parts.push({ text });

  const body = { contents: [{ parts }] };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });

  if(!res.ok){
    const t = await res.text();
    throw new Error(`API ${res.status}: ${t}`);
  }
  const data = await res.json();
  const textResp = data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join('\n') || '(No text in response)';
  return textResp;
}

askBtn.onclick = async () => {
  const apiKey = API_KEY;
  const model  = modelEl.value;
  const text   = promptEl.value;
  const files  = imageInp.files;

  if(!(text || (files && files.length))){ toast('Type a question or attach an image.'); return; }

  // Show the user message immediately
  const userBody = addMessage('me', escapeHtml(text || '(image prompt)'));
  if(files && files.length){ renderPreviews(files, userBody); }

  // Show a typing bubble
  const aiBody = addMessage('ai', '<span class="spinner"></span> Thinking…');

  try{
    const answer = await generateContent({ apiKey, model, text, imageFiles: files || [] });
    aiBody.innerHTML = formatMarkdown(answer);
  }catch(err){
    console.error(err);
    aiBody.innerHTML = `<span class="error">${escapeHtml(err.message)}</span>`;
  }
  finally{
    promptEl.value = '';
    imageInp.value = '';
  }
};

// Tiny Markdown-ish formatter (bold, code, lists, newlines)
function formatMarkdown(s){
  if(!s) return '';
  let html = escapeHtml(s);
  html = html.replace(/```([\s\S]*?)```/g, (_,code)=>`<pre><code>${escapeHtml(code)}</code></pre>`);
  html = html.replace(/`([^`]+)`/g, '<code class="inline">$1</code>');
  html = html.replace(/^\*\s(.+)$/gm,'• $1');
  html = html.replace(/^\d+\.\s(.+)$/gm, m=>m);
  html = html.replace(/\n/g,'<br/>');
  return html;
}

// =====================
// Simple self-tests
// =====================
runDiag.onclick = () => runDiagnostics();

function runDiagnostics(){
  const out = document.getElementById('diag');
  const logs = [];
  let pass = true;
  function ok(msg){ logs.push(`✅ ${msg}`); }
  function fail(msg){ logs.push(`❌ ${msg}`); pass = false; }

  try{
    // Test 1: DOM refs exist
    (chatEl && askBtn && promptEl && imageInp && modelEl && clearBtn && warnEl) ? ok('DOM elements found') : fail('Missing DOM element ref');

    // Test 2: Markdown formatting
    const md = formatMarkdown('Hello\n\n`code`\n\n* item');
    (md.includes('<code') && md.includes('• item')) ? ok('Markdown formatter works') : fail('Markdown formatter failed');

    // Test 3: fileToInlinePart works with Blob
    const blob = new Blob([new Uint8Array([137,80,78,71])], { type: 'image/png' });
    const fakeFile = new File([blob], 't.png', { type: 'image/png' });
    fileToInlinePart(fakeFile).then(p=>{
      (p && p.inline_data && p.inline_data.data) ? ok('fileToInlinePart encodes base64') : fail('fileToInlinePart failed');
      finish();
    }).catch(()=>{ fail('fileToInlinePart threw'); finish(); });

  }catch(e){
    fail('Unexpected exception: '+e.message);
    finish();
  }

  function finish(){
    out.style.display = 'block';
    out.className = pass ? 'hint pass' : 'hint fail';
    out.innerHTML = logs.map(l=>`<div>${l}</div>`).join('');
  }
}
