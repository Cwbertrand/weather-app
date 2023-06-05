import { 
    setLocationObject, 
    getHomeLocation,
    getCoordsFromApi,
    cleanText 
} from "./dataFunctions.js";

import { 
    setPlaceholderText,
    addSpinner, 
    displayError, 
    displayApiError, 
    updateScreenReaderConfirmation
} from "./domFunctions.js";

import CurrentLocation from "./CurrentLocation.js";


const currentLoc = new CurrentLocation();


const initApp = () => {
    //========ADD EVENT LISTENERS ======//

    //this gets the geo location
    const getButton = document.getElementById('getLocation');
    getButton.addEventListener('click', getGeoWeather);

    //when clicked on the home button
    const homeButton = document.getElementById('home');
    homeButton.addEventListener('click', loadWeather);

    //the save button saves weather data
    const saveButton = document.getElementById('saveLocation');
    saveButton.addEventListener('click', saveLocation);

    //when clicked, it changes the unit to celcius or fahrenheit
    const unitButton = document.getElementById('unit');
    unitButton.addEventListener('click', setUnitPref);

    //click to refresh
    const refreshButton = document.getElementById('refresh');
    refreshButton.addEventListener('click', refreshWeather);

    //search for location on the search input
    const locationSearch = document.getElementById('searchBar__form');
    locationSearch.addEventListener('submit', submitNewLocation);


    //======== APPLICATION SET UPS ======//
    //this is a javascript media query
    setPlaceholderText();

    //======== LOAD WEATHER DATA ======//

    loadWeather();
}

document.addEventListener('DOMContentLoaded', initApp);

//Getting the weather data
const getGeoWeather = (event) => {
    //if event does exist
    if (event) {
        //if event is a click
        if (event.type === 'click') {
            //add spinner to the button when it's click
            const mapIcon = document.querySelector('.fa-map-marker-alt');
            addSpinner(mapIcon);
        }
    }

    //if we don't get the geolocation we return an error
    if (!navigator.geolocation) geoError(); //GeolocationPositionError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

//Error handling method
const geoError = function (errObj) {
    const errMg = errObj.message ? errObj.message : "Geolocation not supported";
    displayError(errMg, errMg);
}

//success handling method
const geoSuccess = (position) => {
    //creating the object of position (lat and long)
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `lat:${position.coords.latitude} lon:${position.coords.longitude}`
    }

    //setting the location object
    setLocationObject(currentLoc, myCoordsObj);
    //update data and display properties
    updateDataAndDisplayProperties(currentLoc);
}

//the loadweather function that permits the data to load on the screen
const loadWeather = (event) => {
    //if the weather is already saved inside the local storage
    const savedLocation = getHomeLocation();
    //if we don't have a saved location
    if (!savedLocation && !event) return getGeoWeather();

    //if there's no save location but there is a click, you call the displayError function that has been created already
    if (!savedLocation && event.type === 'click') {
        displayError(
            'No home location available',
            'Sorry, please save your home location first'
        )
    } else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation);
    } else {
        const homeIcon = document.querySelector('.fa-home');
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
}

const displayHomeLocationWeather = (home) => {
    if (typeof home === 'string') {
        const locationJson = JSON.parse(home);
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name,
            unit: locationJson.unit
        }
        setLocationObject(currentLoc, myCoordsObj);
        updateDataAndDisplayProperties(currentLoc);
    }
}

//save location function which finally saves it when the save button is clicked
const saveLocation = () => {
    if (currentLoc.getLat && currentLoc.getLon) {
        const saveIcon = document.querySelector('.fa-save');
        addSpinner(saveIcon);
        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            units: currentLoc.getUnit(),
        }
        //save it into the local storage
        localStorage.setItem('defaultWeatherLocation', JSON.stringify(location));
        updateScreenReaderConfirmation(
            `Save ${currentLoc.getName()} as home location`
        );
    }
}

//the unit function
const setUnitPref = () => {
    const unitIcon = document.querySelector('.fa-chart-bar');
    addSpinner(unitIcon);
    currentLoc.toggleUnit();
    updateDataAndDisplayProperties(currentLoc);
}

//refresh weather data function
const refreshWeather = () => {
    const refreshIcon = document.querySelector('.fa-sync-alt');
    addSpinner(unitIcon);
    updateDataAndDisplayProperties(currentLoc);
}

//function for the search button
const submitNewLocation = async (event) => {
    //a form reloads the page by default, so we prevent it from going to another page
    event.preventDefault();
    const text = document.getElementById('searchBar__text').value;
    const entryText = cleanText(text);
    if (!entryText.length) return;
    const locationIcon = document.querySelector('.fa-search');
    addSpinner(locationIcon);

    //getting the api data
    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());

    if(coordsData){
        if (coordsData.cod === 200) {
            //work with api data
            const myCoordsObj = {
                lat: coordsData.coords.lat,
                lon: coordsData.coords.lon,
                name: coordsData.coords.name ? ` ${coordsData.name}, ${coordsData.sys.country}` : coordsData.name
            };
            //succss
    
            setLocationObject(currentLoc, myCoordsObj);
            updateDataAndDisplayProperties(currentLoc);
        } else {
            //if we don't get the api data
            displayApiError(coordsData);
        }
    }else{
        displayError('Connection error', 'Connection Error');
    }
}









//creating the update data and display properties method
//the async() means its an asyncchronous function. it uses 'await()' keyword to pause the execution and awaits for asynchronous operations to complete
const updateDataAndDisplayProperties = async (locationObj) => {
    //const weatherJson = await getWeatherFromCoordss(locationObj);
    //if(weatherJson) updateDisplay(weatherJson, locationObj);
}