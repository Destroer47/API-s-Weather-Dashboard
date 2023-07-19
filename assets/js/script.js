let cityForm = document.getElementById('search');
let citySearchForm = document.getElementById('city-name');
let cityBox = document.getElementById('city-box');
let cityTemp = document.getElementById('city-temp');
let cityWind = document.getElementById('city-wind');
let cityHumidity = document.getElementById('city-humidity');
let forecastCards = document.getElementById('forecast-cards');

let apiKey="d961fc33bcb66011fea3503eeae4c5ed";
let citySearchVal

function searchCity(event) {
    event.preventDefault();
    citySearchVal = citySearchForm.value.trim();

    if (!citySearchVal) {
        return alert('Please enter a City');
    }

    else {
        cityBox.innerHTML = "";
        forecastCards.innerHTML = "";
        getCoordinates(citySearchVal);
        citySearchForm.value = '';
    }
}

function getCoordinates(citySearchVal) {
    let geocodeApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + citySearchVal + "&appid=" + apiKey;

    fetch(geocodeApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    let lat = data[0].lat
                    let lon = data[0].lon
                    getCurrentWeather(lat, lon);
                    get5DayForecast(lat, lon);
                    citySearchVal = null;
                });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather API');
        });
};

function getCurrentWeather(lat, lon) {
    let currentWeatherApi = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

    fetch(currentWeatherApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentWeather(data);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather API');
        })
}

function get5DayForecast(lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data2) {
                    display5DayForecast(data2);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather API');
        })
}

function displayCurrentWeather(data) {
    let weatherIcon = data.weather[0].icon
    let iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
    let cityDate = document.createElement('h2');
    let lineBr = document.createElement('br');
    let weatherIconImg = document.createElement('img');

    cityDate.setAttribute("id", "city-date");
    weatherIconImg.className = "weather-icon";
    weatherIconImg.src = iconUrl;
    let todaysDate = dayjs().format('M/D/YYYY');
    cityDate.textContent = data.name + " (" + todaysDate + ")";
    cityTemp.textContent = "Temp: " + data.main.temp + "°F";
    cityWind.textContent = "Wind: " + data.wind.speed + " MPH";
    cityHumidity.textContent = "Humidity: " + data.main.humidity + " %";

    cityBox.appendChild(cityDate);
    cityDate.appendChild(lineBr);
    cityBox.appendChild(weatherIconImg);
}

function display5DayForecast(data2) {
    let forecastData = data2.list.filter(item => item.dt_txt.includes("12:00:00"));
    for (let i=0; i < forecastData.length; i++) {
        let weatherIcon = forecastData[i].weather[0].icon
        let iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
        let oneDayCard = document.createElement('div');
        let cityDate = document.createElement('h2');
        let weatherIconImg = document.createElement('img');
        let temp = document.createElement('p');
        let wind = document.createElement('p');
        let humidity = document.createElement('p');
        let lineBr = document.createElement('br');

        oneDayCard.className = "forecast-card";
        let date = dayjs(forecastData[i].dt_txt).format('M/D/YYYY');
        cityDate.textContent = date;
        temp.textContent = "Temp: " + forecastData[i].main.temp + "°F";
        wind.textContent = "Wind: " + forecastData[i].wind.speed + " MPH";
        humidity.textContent = "Humidity: " + forecastData[i].main.humidity + " %";
        weatherIconImg.className = "weather-icon";
        weatherIconImg.src = iconUrl;

        forecastCards.appendChild(oneDayCard);
        oneDayCard.appendChild(cityDate);
        cityDate.appendChild(lineBr);
        oneDayCard.appendChild(weatherIconImg);
        weatherIconImg.appendChild(lineBr);
        oneDayCard.appendChild(temp);
        temp.appendChild(lineBr);
        oneDayCard.appendChild(wind);
        wind.appendChild(lineBr);
        oneDayCard.appendChild(humidity);
    }
}

function onLoad(citySearchVal) {
    citySearchVal = "Chicago";
    getCoordinates(citySearchVal);
}

cityForm.addEventListener('submit', searchCity);

onLoad(citySearchVal);

//remember: give dynamically generated elements classes to style them, and then just have that class styled in css