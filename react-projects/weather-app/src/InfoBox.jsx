import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SunnyIcon from '@mui/icons-material/Sunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import './InfoBox.css';

export default function InfoBox({info}) {
    const INIT_URL = "https://images.unsplash.com/photo-1673191898695-8252d409d82c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHVzdHklMjB3ZWF0aGVyfGVufDB8fDB8fHww";

    let COLD_URL = "https://images.unsplash.com/photo-1550077404-c00d89693129?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNvbGQlMjB3ZWF0aGVyfGVufDB8fDB8fHww";
    let HOT_URL = "https://images.unsplash.com/photo-1524594081293-190a2fe0baae?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
    let RAIN_URL = "https://media.istockphoto.com/id/1476190237/photo/summer-rain-raindrops-bad-weather-depression.webp?a=1&b=1&s=612x612&w=0&k=20&c=AqmeafeXtSEbnuq1mxdDr9nSrXunta3huhlXpLRMnes=";
   
    return (
        <div className="InfoBox">
   
    <div className='CardContainer'>
        <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={info.humidity > 80? RAIN_URL : info.temp > 20 ? HOT_URL : COLD_URL}
      />
      <CardContent>
        <Typography className='cityName' gutterBottom variant="h5" component="div">
         {info.city}  <span>{info.temp > 20 ? <SunnyIcon/> : info.humidity > 80 ? <WaterDropIcon/> : <AcUnitIcon/>}</span>
        </Typography>
        <Typography className="temp" variant="body2" sx={{ color: 'text.secondary'} } component={"span"}>
         <p>Temprature = {info.temp}&deg;C</p>
         <p>Humidity = {info.humidity}</p>
         <p>Min Temp = {info.temp_Min}&deg;C</p>
         <p>Max Temp = {info.temp_Max}&deg;C</p>
         <p className='weatherDesc'>
            The weather can be described as <i>{info.weather}</i> and feels like {info.feels_like}&deg;C
         </p>
        </Typography>
      </CardContent>
    </Card>
    </div>
        </div>
    )
}