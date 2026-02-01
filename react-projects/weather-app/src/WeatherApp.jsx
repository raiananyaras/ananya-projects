import { useState } from "react";
import InfoBox from "./InfoBox";
import SearchBox from "./SearchBox";

export default function WeatherApp() {

    let [weatherInfo, setWeatherInfo] = useState( {
        city: "Jabalpur",
       feels_like: 10.13,
humidity: 69,
temp: 11.16,
temp_Max: 11.16,
temp_Min: 11.16,
weather: "overcast clouds" 
    }
    );

    let updateInfo = (result) => {
    setWeatherInfo(result);
    }

    return (
        <div style={{textAlign: "center"}}>
            <h2>Search your city :)</h2>
            <SearchBox updateInfo={updateInfo}/>
            <InfoBox info={weatherInfo}/>
        </div>
    )
}