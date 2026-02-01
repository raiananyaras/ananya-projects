import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import './SearchBox.css';
import { useState } from 'react';


export default function SearchBox({updateInfo}) {
      let [city, setCity] = useState("");
      let [error, setError] = useState(false);
    
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "846511c6ad9e4a908fcce8afdb48fab4";

    let getWeatherInfo = async () => {
        try{
 let reponse = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        let jsonResponse = await reponse.json();
        let result = {
            city: city,
            temp: jsonResponse.main.temp,
            temp_Min: jsonResponse.main.temp_min,
            temp_Max: jsonResponse.main.temp_max,
            feels_like: jsonResponse.main.feels_like,
            humidity: jsonResponse.main.humidity,
            weather: jsonResponse.weather[0].description
        };
        console.log(result);
       return result;
        }
        catch(err) {
           throw err;
        }
       
    }
  

let handleChange = (event) => {
 setCity(event.target.value);
}

let handleSubmit = async (event) => {
    try{
 event.preventDefault();
    setCity("");
    let newInfo = await getWeatherInfo();
    updateInfo(newInfo);
    }
   catch(err) {
setError(true);
   }
}

    return (
        <div className='SearchBox'>
     
        <form onSubmit={handleSubmit}>
<TextField className='MuiTextField-root' id="city" label="City Name" variant="outlined" required value={city} onChange={handleChange}/>
<br /> <br />
<Button variant="contained" type='submit' className='MuiButton-root'>
        Search
      </Button>
      {error && <p style={{color: "red"}}>No such place exits!</p>}
        </form>
        </div>
    );
}