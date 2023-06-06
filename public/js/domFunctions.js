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

export const updateDisplay = (weatherJson, locationObj) => {
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