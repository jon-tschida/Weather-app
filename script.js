`use strict`;

// Selecting elements in DOM
const dateContent = document.querySelector(`.date-content`);
const timeContent = document.querySelector(`.time-content`);
const currentTemp = document.querySelector(`.current-temp-weather`);
const timeZoneContent = document.querySelector(`.timezone-content`);

const weatherForecast = document.querySelector(`.weather-forecast`);

const moreInfo = document.querySelector(`.more-info`);

// Hourly Rows
const row1 = document.querySelector(`.row-1`);
const row2 = document.querySelector(`.row-2`);

// formatting the time //
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}

// using our function above to create an Hour:Minute time
// setting our time text content to the current time, it will be updated in the interval below
const time = formatAMPM(new Date());
timeContent.textContent = time;

// Using setInterval to update the minute every 1 second
setInterval(function () {
    const time = formatAMPM(new Date());
    timeContent.textContent = `${time}`;
}, 1000);

// Formatting the date //

const dateOptions = {
    weekday: `long`,
    // year: `numeric`,
    month: `short`,
    day: `numeric`,
};
// Calling the date outside of the interval to make sure we don't see placeholder text
const date = new Date();
const formatDate = new Intl.DateTimeFormat(`en-US`, dateOptions).format(date);
dateContent.textContent = formatDate;

setInterval(function () {
    const date = new Date();
    const formatDate = new Intl.DateTimeFormat(`en-US`, dateOptions).format(date);
    dateContent.textContent = formatDate;
}, 1000);




//
//  Functions for populating Hourly and Daily forecasts //
//
const showWeather = function (data) {
    let { temp, feels_like, temp_min, temp_max, humidity } = data.main;
    let wind_speed = data.wind.speed;
    currentTemp.innerHTML = `
            <div class="cur-temp-content">${Math.trunc(
        ((temp - 273.15) * 9) / 5 + 32
    )}°f</div>
            <div class="high-and-low">↑${Math.trunc(
        ((temp_max - 273.15) * 9) / 5 + 32
    )}° ↓${Math.trunc(((temp_min - 273.15) * 9) / 5 + 32)}°</div>
            <div class="weather-item">
                <div>Feels like</div>
                <div>Wind Speed</div>
            </div>
            <div class="weather-item">
                <div>${Math.trunc(((feels_like - 273.15) * 9) / 5 + 32)}°</div>
                <div>${Math.trunc(wind_speed * 2.237)} mph</div>
            </div>
    `;
};

const populateDaily = function (data) {
    let otherDayForecast = ``;
    data.daily.forEach((day, i) => {
        if (i === 0) {
        } else {
            let weekdayDate = new Date(day.dt * 1000);
            let weekday = new Intl.DateTimeFormat(`en-US`, {
                weekday: `short`,
            }).format(weekdayDate);
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${weekday}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day: ${Math.trunc(
                    ((day.temp.day - 273.15) * 9) / 5 + 32
                )}°</div>
                <div class="temp">Night: ${Math.trunc(
                    ((day.temp.night - 273.15) * 9) / 5 + 32
                )}°</div>
            </div>
            `;
        }
    });
    weatherForecast.innerHTML = otherDayForecast;
};

const populateHourly = function (data) {
    let row1HourForecast = ``;
    for (let i = 0; i < 4; i++) {
        let dateHour = new Date(data.hourly[i].dt * 1000);
        row1HourForecast += `
        <div class="hourly-item-r1">
        <div>${formatAMPM(dateHour)}</div>
        <hr>
        <div class="hourly-item-r1-content">
            <div>${Math.trunc(((data.hourly[i].temp - 273.15) * 9) / 5 + 32)}°</div>
        </div>
    </div>
    `;
    }
    row1.innerHTML = row1HourForecast;

    let row2HourForecast = ``;
    for (let i = 4; i < 8; i++) {
        let dateHour = new Date(data.hourly[i].dt * 1000);
        row2HourForecast += `
    <div class="hourly-item-r2">
                    <div>${formatAMPM(dateHour)}</div>
                    <hr>
                    <div class="hourly-item-r2-content">
            <div>${Math.trunc(((data.hourly[i].temp - 273.15) * 9) / 5 + 32)}°</div>
        </div>
                </div>
    `;
    }
    row2.innerHTML = row2HourForecast;
};


//
// API Calls for the weather data //
//

// putting the API calls inside our current position funcion, so we can just automatically get the lat and long from the user. 
navigator.geolocation.getCurrentPosition(function (location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;

    // This API call handles the hours and 7 day forecast
    let data;
    let request = new XMLHttpRequest();
    request.open(
        `GET`,
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&appid=AddAPIkeyHERE`
    );
    request.send();
    request.onload = () => {
        if (request.status == 200) {
            data = JSON.parse(request.response);
        } else {
            console.log(`error: ${request.status}, ${request.statusText}`);
        }
        populateDaily(data);
        populateHourly(data);
    };

    // This API call retrieves our current temp, min, max, wind, feels like, humidity
    let data2;
    let request2 = new XMLHttpRequest();
    request2.open(
        `GET`,
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=AddAPIkeyHERE`
    );
    request2.send();
    request2.onload = () => {
        if (request2.status == 200) {
            data2 = JSON.parse(request2.response);
        } else {
            console.log(`error: ${request2.status}, ${request2.statusText}`);
        }
        showWeather(data2);
    };
});
