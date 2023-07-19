let cityForm = document.getElementById('search');
let citySearchForm = document.getElementById('city-name');
let apiKey="d961fc33bcb66011fea3503eeae4c5ed"

function searchCity(event) {
    event.preventDefault();

    let citySearchVal = citySearchForm.value.trim();
    console.log(citySearchVal);

    if (!citySearchVal) {
        alert('Please enter a City');
    }

    else {
        getCoordinates(citySearchVal);
        citySearchForm.value = '';
    }
}

function getCoordinates(citySearchVal) {
    console.log(citySearchVal);
    let geocodeApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + citySearchVal + "&appid=" + apiKey;
    let lat
    let lon

    fetch(geocodeApi)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    lat = data[0].lat
                    lon = data[0].lon
                    console.log(lat);
                    console.log(lon);
                    getWeatherApi(lat, lon);
                });
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather API');
        });
};

function getWeatherApi(lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                })
            } else {
            alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather API');
        })
}


cityForm.addEventListener('submit', searchCity);
