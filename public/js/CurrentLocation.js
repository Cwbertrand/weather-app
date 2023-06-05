export default class CurrentLocation{
    
    //constructor function in js
    constructor(){
        this._name = 'Current Location';
        this._lat = null;
        this._lon = null;
        this._unit = 'imperial';
    }

    //getters in js
    getName(){
        return this._name;
    }

    //setters in js
    setName(name){
        this._name = name;
    }

    getLat(){
        return this._lat;
    }

    setLat(lat){
        this._lat = lat;
    }

    getLon(){
        return this._lon;
    }

    setLon(lon){
        this._lon = lon;
    }

    getUnit(){
        return this._unit;
    }

    setUnit(unit){
        this._unit = unit;
    }

    //to toggle the unit between imperial and metric
    toggleUnit(){
        this._unit = this._unit === 'imperial' ? 'metric' : 'imperial';
    }


}