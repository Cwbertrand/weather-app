const API_WEATHER_KEY = 'e7ce63453a9487573f8c4d2bd697c7a6';

export const setLocationObject = (locationObj, coordsObj) => {
    const {lat, lon, name, unit} = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if(unit){
        locationObj.setUnit(unit);
    }
}

export const getHomeLocation = () => {
    return localStorage.getItem('defaultWeatherLocation');
}

export const getWeatherFromCoords = async (locationObj) => {
    const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const units = locationObj.getUnit();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude
    =minutely,hourly,alerts&units=${units}&appid=${API_WEATHER_KEY}`;
    try{
        //fetching the data from the api endpoint
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json();
        return weatherJson;
    }catch(e){
        console.error(e.stack);
    }
}

//creating the api object method
export const getCoordsFromApi = async (entryText, units) => {
    //this are numbers
    const regex = /^\d+$/g;

    //to text if regex is number or string
    const flag = regex.test(entryText) ? 'zip' : 'q';
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${API_WEATHER_KEY}`;
    //encoding url where spaces can be when the user is entering the coordinates
    const encodeUrl = encodeURI(url);
    try{
        const dataStream = await fetch(encodeUrl);
        const jsonData = await dataStream.json();
        return jsonData;
    }catch(e){
        console.error(e.stack);
    }
}


//this method removes spaces not needed when a search is entred
export const cleanText = (text) => {
    //removing 2 or more spaces
    const regex = / {2,}/g; //g stands for the global text

    //this replaces 2 or more stapces into one space
    //and this handles spaces before and after the string
    const entryText = text.replaceAll(regex, " ").trim();
    return entryText;
}