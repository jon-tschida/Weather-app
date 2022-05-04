# Weather-app

#### View a working version [HERE](https://pleasehirejon.com/project-info/weather-app-info)

### Languages
- HTML
- CSS
- JavaScript
- [OpenWeather API](https://openweathermap.org/api)

### Purpose for creating this project
This was the first time I had tried parsing info from an API into a project to dynamically generate content. I created this mainly to learn how to create an API call, parse it into a JSON response, and then use that to generate/populate content on a page. 

I know that this is a popular project for aspiring developers to create, but I think it is for good reason. I learned a lot from this, and it gave me a lot of confidence to try to create other projects (such as the [Pokemon lookup](https://github.com/jon-tschida/Pokemon-Lookup) project)

### Challenges that arrose

The main challenge was trying to figure out how to make an API call via JS, we ended up using XMLHttpRequest(), I don't have much of a reason for this outside of it felt like it made the most sense to me and I knew how to implement it. There very well could be a better alternative. 

It took a bit to figure out how to dynamically congregate all the info into an HTML element, I think the implementation we landed on works pretty well in this case though. Create an empty string, and use a forEach() method on the array of data from the API to add to that empty string, then we just make the innerHTML element of the section equal the (formally) empty string, for example:

```
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
```

### What I learned

This was one of the first HTML and CSS projects I made entirely from scratch with no assistance (looking back it isn't the prettiest), but I learned a lot about the CSS box model and utilizing `border: solid green;` to actually visualize where the blocks are.

---

For safety, the API key was removed, if you want a working copy of this, you will have to get a free API key from openweather and add it to the script.js file.
The location to add the API key is at the bottom of script.js, in the XMLHttpRequest's 
