`use strict`;

// Selecting elements in DOM
const dateContent = document.querySelector(`.date-content`);
const timeContent = document.querySelector(`.time-content`);

const currentTemp = document.querySelector(`.current-temp`);

const timeZoneContent = document.querySelector(`.timezone-content`);


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
timeContent.textContent = time

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
    day: `numeric`
}
// Calling the date outside of the interval to make sure we don't see placeholder text
const date = new Date();
const formatDate = new Intl.DateTimeFormat(`en-US`, dateOptions).format(date);
dateContent.textContent = formatDate

setInterval(function () {
    const date = new Date();
    const formatDate = new Intl.DateTimeFormat(`en-US`, dateOptions).format(date);
    dateContent.textContent = formatDate


}, 1000);


let data;
let request = new XMLHttpRequest();
request.open(
    `GET`,
    `https://api.openweathermap.org/data/2.5/onecall?lat=41.2714&lon=-95.9386&exclude=minutely&appid=2a8ab662e8539e2cb45726e6080084e6`
);
request.send();
request.onload = () => {
    // console.log(request);
    if (request.status == 200) {
        data = JSON.parse(request.response);
        console.log(data)
    } else {
        console.log(`error: ${request.status}, ${request.statusText}`);
    }
    timeZoneContent.textContent = `${data.timezone} timezone`
    showWeather(data);
};
const showWeather = function (data) {
    let { temp, feels_like, humidity, wind_speed, sunrise, sunset } = data.current;
    currentTemp.innerHTML = `
    <div class="weather-item">
            <div>Current Temp</div>
            <div>${Math.trunc((temp - 273.15) * 9 / 5 + 32)} °F</div>
        </div>
        <div class="weather-item">
            <div>Feels like</div>
            <div>${Math.trunc((feels_like - 273.15) * 9 / 5 + 32)} °F</div>
        </div>
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${Math.trunc(wind_speed * 2.237)}MPH</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${formatAMPM(new Date(sunrise * 1000))}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${formatAMPM(new Date(sunset * 1000))}</div>
        </div>
    `
}
// https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=-${longitude}&appid=2a8ab662e8539e2cb45726e6080084e6