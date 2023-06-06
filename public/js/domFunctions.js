//Helper functions: these are functions that are created to be used by another function.

export const setPlaceholderText = () => {
    const input = document.getElementById('searchBar__text');
    //if the width of the screen is less than 400px
    //we will use an iternary statement here
    window.innerWidth < 400 ? (input.placehoder = "City, State, Country") : (input.placehoder = "City, State, Country, Postal Code, Postal Code");
}

export const addSpinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
}

//this animates the button when home button is clicked
const animateButton = (element) => {
    element.classList.toggle('none');
    element.nextElementSibling.classList.toggle('block');
    element.nextElementSibling.classList.toggle('none');
}

//displaying the various error messages 1st a header error message then a screen error message
export const displayError = (headerMsg, srMrg) => {
    updateWeatherLocationHeader(headerMsg);
    updateScreenReaderConfirmation(srMrg);
}

// display error message when api data is not available
export const displayApiError = (statusCode) => {
    const properMsg = toProperCase(statusCode.message);
    updateWeatherLocationHeader(properMsg);
    // `` this is called a template literal in js where you can pass it a js code
    updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
}

const toProperCase = (text) => {
    //this splits the text base on the spaces between the word
    const words = text.split(' ');

    //map is a higher order function in js like kind of a foreach
    const properWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properWords.join(' ');
}

//creating helper functions so as not to constantly repeat rewriting the function
const updateWeatherLocationHeader = function(message) {
    const h1 = document.getElementById('currentForecast__location');
    h1.textContent= message;
}

export const updateScreenReaderConfirmation = function(message) {
    document.getElementById('confirmation').textContent = message;
};

//this uploads all the data on the screen from the weather api
export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay();
    clearDisplay();

    //getting the new weather data
    const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
    
    //displaying weather data on the screen
    const screenReaderWeather = buildScreenReaderWeather(weatherJson, locationObj);
    updateScreenReaderConfirmation(screenReaderWeather);
    updateWeatherLocationHeader(locationObj.getName());

    //displaying the current conditions and the forecast
    const currentConditionsArray = createCurrentConditionsDivsHTML(weatherJson, locationObj.getUnit());

    //displaying it
    displayCurrentConditions(currentConditionsArray);
    setfocusOnSearch();

    setBGImage(weatherClass);
    fadeDisplay();
}

const fadeDisplay = function(){
    const currentConditions = document.getElementById('currentForcast');
    currentConditions.toggle('zero-vis');
    currentConditions.toggle('fade-in');
    const sixDays = document.getElementById('dailyForcast');
    sixDays.toggle('zero-vis');
    sixDays.toggle('fade-in');
}

//this clears the content in the current weather condition table
const clearDisplay = function(){
    const clearCurrentConditions = document.getElementById('currentForcast__conditions');
    deleteContents(clearCurrentConditions);
    const sixDaysForcast = document.getElementById('dialyForcast__contents');
    deleteContents(sixDaysForcast);
}

//creating the deletecontents function
const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

//determining the icons to use in respect to the weather conditions
const getWeatherClass = (icon) => {
    const firstTwoChars = icon.splice(0, 2);
    const lastChar = icon.slice(2);
    const weatherLookUp = {
        '09': 'snow',
        '10': 'rain',
        '11': 'rain',
        '13': 'snow',
        '50': 'fog',
    };
    let weatherClass;
    //chosing day or night
    if(weatherLookUp[firstTwoChars]){
        weatherClass = weatherLookUp[firstTwoChars];
    }else if(lastChar === 'd'){
        weatherClass = 'Clouds';
    }else{
        weatherClass = 'night';
    }

    return weatherClass;
}

//determining the image to use in respect to the weather conditions
const setBGImage = function(weatherClass){
    document.documentElement.classList.add(weatherClass);
    document.documentElement.classList.forEach(img =>{
        if(img != weatherClass) document.documentElement.classList.remove(img);
    });
}

//what is to be seen by the screen reader
const buildScreenReaderWeather = (weatherJson, locationObj) => {
    const location = locationObj.getName();
    const unit = locationObj.getUnit();
    const tempUnit = unit === 'imperial' ? 'F' : 'C';
    return `${weatherJson.current.weather[0].description} and ${Math.round(Number(weatherJson.current.temp))}°
            ${tempUnit} in ${location}`;
}

const setfocusOnSearch = () => {
    document.getElementById('searchBar__text').focus();
}

//creating the html for displaying the current weather information
const createCurrentConditionsDivsHTML = (weatherObj, unit) => {
    const tempUnit = unit === 'imperial' ? 'F' : 'C';
    const windUnit = unit === 'imperial' ? 'mph' : 'm/s';
    const icon = createMainImageDiv(weatherObj.current.weather[0].icon, weatherObj.current.weather[0].description);
    const temp = createElem('div', 'temp', `${Math.round(weatherObj.current.temp)}°`);
    const properDesc = toProperCase(weatherObj.current.weather[0].description);
    const desc = createElem('div', 'desc', properDesc);
    const feels = createElem('div', 'feels' `feels like ${Math.round(Number(weatherObj.current.feels_like))}°`);
    const maxTemp = createElem('div', 'maxtemp' `High ${Math.round(Number(weatherObj.daily[0].temp.max))}`);
    const minTemp = createElem('div', 'mintemp' `High ${Math.round(Number(weatherObj.daily[0].temp.min))}`);
    const humidity = createElem('div', 'humidity' `Humidity ${Math.round(Number(weatherObj.current.humidity))}%`);
    const wind = createElem('div', 'wind' `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`);

    return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
}

//helper function for cccDHTML method for dynamically generating images
const createMainImageDiv = (icon, altText) => {
    const iconDiv = createElem('div', 'icon');
    iconDiv.id = 'icon';
    const falcon = translateIconToFontAwesome(icon);
    falcon.arialHidden = true;
    falcon.title = altText;
    iconDiv.appendChild(falcon);
    return iconDiv;
}

const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType);
    div.className = divClassName;
    if(divText){
        div.textContent = divText;
    }
    if(divClassName === 'temp'){
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('unit');
        unitDiv.textContent = unit;
        div.appendChild(unitDiv);
    }
    return div;
}

//this method creates the icon at for the current weather and forecast condition
const translateIconToFontAwesome = (icon) => {
    const i = document.createElement('i');
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    switch(firstTwoChars){
        case '01':
            if(lastChar === 'd'){
                i.classList.add('far', 'fa-sun');
            }else{
                i.classList.add('far', 'fa-moon');
            }
        break;
        case '02':
            if(lastChar === 'd'){
                i.classList.add('fas', 'fa-cloud-sun');
            }else{
                i.classList.add('fas', 'fa-cloud-moon');
            }
        break;
        case '03':
            i.classList.add('fas', 'fa-cloud');
        break;
        case '04':
            i.classList.add('fas', 'fa-cloud-meatball');
        break;
        case '09':
            i.classList.add('fas', 'fa-cloud-rain');
        break;
        case '10':
            if(lastChar === 'd'){
                i.classList.add('fas', 'fa-cloud-sun-rain');
            }else{
                i.classList.add('fas', 'fa-cloud-moon-rain');
            }
        break;
        case '11':
            i.classList.add('fas', 'fa-poo-storm');
        break;
        case '13':
            i.classList.add('far', 'fa-snowflake');
        break;
        case '50':
            i.classList.add('fas', 'fa-smog');
        break;
        default:
            i.classList.add('far', 'fa-question-circle');
    }
    return i;
}

const displayCurrentConditions = (currentConditionsArray) => {
    const ccContainer = document.getElementById('currentForecast__conditions');
    currentConditionsArray.forEach(cc => {
        ccContainer.appendChild(cc);
    });
}
