"use strict";

let apiKey = localStorage.getItem("owmApiKey");

function currentWeather(data) {
    let cWeatherHTML =
        `
            <h3 class="m-0">Temperature: ${data.main.temp}º</h3>
            <h5 class="m-0">High/Low: º${data.main.temp_max}/${data.main.temp_min}º</h5>
            <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
            <h5 class="m-0">${data.weather[0].main}: ${data.weather[0].description}</h5>
            <h5 class="m-0">Humidity: ${data.main.humidity}</h5>
            <h5 class="m-0">Wind: ${data.wind.speed}mph</h5>
            <h5 class="m-0">Pressure: ${data.main.pressure}</h5>
        `;
    $("#cityName").text(data.name);
    $("#weatherCurrent").html(cWeatherHTML);
}

let weatherData = {};
let forcastData = {};

function getAPIData(lat = 29.42, lon = -98.5) {
    $.get("https://api.openweathermap.org/data/2.5/weather", {
        APPID: apiKey,
        "lat": lat,
        "lon": lon,
        units: "imperial",
    }).done(function (data) {
        weatherData = data;
        currentWeather(data);

    });
    $.get("https://api.openweathermap.org/data/2.5/forecast", {
        APPID: apiKey,
        "lat": lat,
        "lon": lon,
        units: "imperial",
        cnt: 30
    }).done(function (data) {
        forcastData = data;
        parseForcastData(data);
        processForecastData(dayData);
    });

}


function addDays(date, days) {
    return new Date(date.setDate(date.getDate() + days));
}

let dayData = {};

function parseForcastData(data) {
    dayData = {
        day1Data: [],
        day2Data: [],
        day3Data: [],
    };
    for (let i = 1; i < 4; i++) {
        let date = new Date();
        let dateString = addDays(date, i).toDateString();
        data.list.forEach((data) => {
            if (new Date(data.dt_txt).toDateString() === dateString) {
                dayData[`day${i}Data`].push(data);
            }
        });
    }
}

function processForecastData(data) {
    let day1Avg = {};
    let max = -200;
    let min = 200;
    let hum = 0;
    let wind = 0;
    let pres = 0;
    data.day1Data.forEach((day, i) => {
        if (day.main.temp_max > max) {
            max = day.main.temp_max;
        }
        if (day.main.temp_min < min) {
            min = day.main.temp_min;
        }
        hum += day.main.humidity;
        wind += day.wind.speed;
        pres += day.main.pressure;
        if (i === 6) {
            day1Avg.dt_txt = day.dt_txt;
            day1Avg.weather = {
                "desc": day.weather[0].description,
                "id": day.weather[0].id,
                "icon": day.weather[0].icon,
                "main": day.weather[0].main,
            }
        }
    });
    day1Avg.temp_max = max;
    day1Avg.temp_min = min;
    day1Avg.humidity = (hum / data.day1Data.length);
    day1Avg.wind = (wind / data.day1Data.length);
    day1Avg.pressure = (pres / data.day1Data.length);

    let day2Avg = {};
    max = -200;
    min = 200;
    hum = 0;
    wind = 0;
    pres = 0;
    data.day2Data.forEach((day, i) => {
        if (day.main.temp_max > max) {
            max = day.main.temp_max;
        }
        if (day.main.temp_min < min) {
            min = day.main.temp_min;
        }
        hum += day.main.humidity;
        wind += day.wind.speed;
        pres += day.main.pressure;
        if (i === 6) {
            day2Avg.dt_txt = day.dt_txt;
            day2Avg.weather = {
                "desc": day.weather[0].description,
                "id": day.weather[0].id,
                "icon": day.weather[0].icon,
                "main": day.weather[0].main,
            }
        }
    });
    day2Avg.temp_max = max;
    day2Avg.temp_min = min;
    day2Avg.humidity = (hum / data.day1Data.length);
    day2Avg.wind = (wind / data.day1Data.length);
    day2Avg.pressure = (pres / data.day1Data.length);

    let day3Avg = {};
    max = -200;
    min = 200;
    hum = 0;
    wind = 0;
    pres = 0;
    data.day3Data.forEach((day, i) => {
        if (day.main.temp_max > max) {
            max = day.main.temp_max;
        }
        if (day.main.temp_min < min) {
            min = day.main.temp_min;
        }
        hum += day.main.humidity;
        wind += day.wind.speed;
        pres += day.main.pressure;
        if (i === 6) {
            day3Avg.dt_txt = day.dt_txt;
            day3Avg.weather = {
                "desc": day.weather[0].description,
                "id": day.weather[0].id,
                "icon": day.weather[0].icon,
                "main": day.weather[0].main,
            }
        }
    });
    day3Avg.temp_max = max;
    day3Avg.temp_min = min;
    day3Avg.humidity = (hum / data.day1Data.length);
    day3Avg.wind = (wind / data.day1Data.length);
    day3Avg.pressure = (pres / data.day1Data.length);

    displayForecast({"day1Avg": day1Avg, "day2Avg": day2Avg, "day3Avg": day3Avg});
}

function displayForecast(data) {
    for (let i = 1; i < 4; i++) {
        let dayData = data[`day${i}Avg`];
        let weatherHTML =
            `<h2 class="m-0">${new Date(dayData.dt_txt).toDateString()}</h2>
            <br />
            <h5 class="m-0">High/Low: ${dayData.temp_max.toFixed(1)}º/${dayData.temp_min.toFixed(1)}º</h5>
            <img src="http://openweathermap.org/img/w/${dayData.weather.icon}.png">
            <h5 class="m-0">${dayData.weather.main}: ${dayData.weather.desc}</h5>
            <h5 class="m-0">Humidity: ${dayData.humidity.toFixed(1)}</h5>
            <h5 class="m-0">Wind: ${dayData.wind.toFixed(2)}mph</h5>
            <h5 class="m-0">Pressure: ${dayData.pressure.toFixed(1)}</h5>
        `;
        let div = $(`#weather${i}`);
        div.removeClass("hidden");
        div.html(weatherHTML);
    }
}

$('#location_btn').click(function () {
    let lat = $('#lat_tb').val();
    let lon = $('#lon_tb').val();
    getAPIData(lat, lon);
});

getAPIData();

let marker = null;

function initMap() {
    // The location of Uluru
    var sanAntonio = {lat: 29.42, lng: -98.5};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 10, center: sanAntonio});
    // The marker, positioned at Uluru
    marker = new google.maps.Marker({position: sanAntonio, map: map});

    map.addListener('click', function (e) {
        placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
    if (marker !== null) {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    getAPIData(latLng.lat(), latLng.lng());
    map.panTo(latLng);
}
