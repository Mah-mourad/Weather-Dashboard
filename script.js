const search = document.querySelector(".search")
const cityInput = document.querySelector(".city-input")
const weatherData = document.querySelector(".weather-data")
const locationBtn = document.querySelector(".current-location")
const weatherCards = document.querySelector(".weather-cards")
const API_KEY = "d6239e776dec076a6e0dfd22dd97b5e5"

const createWeatherCard = (cityName, weatherItem, index)=>{
    // if(index === 0){
        return `<div class="today">
                <div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}^C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>
            </div>`
    // }
    // else{
    // return `
    //             <li class="card">
    //                 <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    //                 <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
    //                 <h4>temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}^C</h4>
    //                 <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    //                 <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    //             </li>
    
    //         `
    // }
}

const getWeatherDetails = (cityName, lat, lon) =>{
    const WEATHER_API = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(WEATHER_API).then(res => res.json()).then(data =>{
        console.log(data);
        
        const uniqueForecastDays = []; 
            const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate()
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate)
            }
        })
        weatherCards.innerHTML = ''
        cityInput.value =''
        weatherData.innerHTML =''

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index )=>{
            // if(index === 0 ){
                weatherData.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index))
            // }else{
                // weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index))
            }            
        // }
    )
    }).catch(() =>{
        alert("An error occurred")
    })
}
const getCityCoordinates = ()=>{
    const cityName = cityInput.value.trim();
    if(!cityName)return
    const GEOCODING_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
 
    fetch(GEOCODING_API).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`No coordinates found for ${cityName}`) 
            const {name, lat, lon} = data[0]
        getWeatherDetails(name, lat, lon)
    }).catch(() =>{
        alert("An error occurred")
    })
}

const getUserCoordinates = ()=>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const { latitude, longitude} = position.coords
            const REVERSE_GEOCODING_DENIED = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            fetch(REVERSE_GEOCODING_DENIED).then(res => res.json()).then(data =>{
                const {name} = data[0]
                getWeatherDetails(name, latitude, longitude)     
            }).catch(() =>{
                alert("An error occurred")
            })
        },
        error =>{
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation request denied")
            }
            
        }
        
    )
}

locationBtn.addEventListener("click", getUserCoordinates)
search.addEventListener("click", getCityCoordinates)
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates())