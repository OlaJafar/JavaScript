'use strict';

// prettier-ignore


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


class Workout {
    date=new Date();
    id=Date.now();
    constructor(coords,duration,distance) {
        this.coords=coords;
        this.duration=duration;
        this.distance=distance;
    }
    _setDescription(){
        this.description= `${this.type[0].toUpperCase()+this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}

class Running extends Workout{
    constructor(coords,duration,distance,cadence){
        super(coords,duration,distance);
        this.cadence=cadence;
        this.icon='🏃';
        this.pace=this.calcPace();
        this.type='running';
        this._setDescription();
    }
    calcPace(){
        return (this.duration/this.distance).toFixed(2);
    }
}

class Cycling extends Workout{
    constructor(coords,duration,distance,elevationGain){
        super(coords,duration,distance);
        this.elevationGain=elevationGain;
        this.speed=this.calcSpeed();
        this.icon='🚴‍♀️';
        this.type='cycling';
        this._setDescription();
    }
    calcSpeed(){
        return (this.distance/this.duration).toFixed(2);
    }
}

class App{
    #map;
    #eventMarker;
    #workouts=[];
    constructor() {
        this._getPosition();
        this._getData();
        form.addEventListener('submit',this._newWorkout.bind(this));
        inputType.addEventListener('change',this._toggleElevationField.bind(this));
        containerWorkouts.addEventListener('click',this._moveTo.bind(this));
    }
    _getPosition(){
        navigator.geolocation?.getCurrentPosition(this._loadMap.bind(this),function (){});
    }
    _loadMap(position){
        const {latitude,longitude}=position.coords;
        this.#map = L.map('map').setView([latitude, longitude], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click',this.revealForm.bind(this));
        this.#workouts.forEach(workout => {
            this.createMarker(...workout.coords, workout);
        });
    }
    revealForm(clickedMarker){
        this.#eventMarker=clickedMarker;
        form.classList.remove('hidden');
        inputDistance.focus();
    }
    
    _getData(){
        const data=JSON.parse(localStorage.getItem('workouts'));
        if(!data)return;
        this.#workouts=data;
        this.#workouts.forEach(workout=>this._renderWorkout(workout));
    }
    _newWorkout(e){
        e.preventDefault();
        const value=(...inputs)=>inputs.every((input)=>Number.isFinite(input)&&input>0);
        const {lat,lng}=this.#eventMarker.latlng;
        const type=inputType.value;
        const duration=+inputDuration.value;
        const distance=+inputDistance.value;
        let workout;
        if(type==='running'){
            const cadence= +inputCadence.value;
            if(!value(duration,distance,cadence))return alert('Please enter positive numbers');
            workout=new Running([lat,lng],duration,distance,cadence);
        }
        if(type==='cycling'){
            const elevationGain= +inputElevation.value;
            if(!value(duration,distance,elevationGain||1))return alert('Please enter positive numbers');
            workout=new Cycling([lat,lng],duration,distance,elevationGain);
        }
        this.#workouts.push(workout);
        form.classList.add('hidden');
        inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value='';
        this.createMarker(lat,lng,workout);
        this._renderWorkout(workout);
        this._setData();
    }
    createMarker(lat,lng,workout){
        L.marker([lat, lng],{riseOnHover:true}).addTo(this.#map)
            .bindPopup(L.popup({autoClose:false, closeOnClick: false, className:`${inputType.value}-popup`}).setContent(workout.icon+' '+workout.description))
            .openPopup();
    }
    _renderWorkout(workout){
        let html=`
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.icon}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`
        
        if(workout.type==='running')
            html+=`
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`
        
        else
            html+=`
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`
        
        form.insertAdjacentHTML('afterend',html);
    }
    _setData(){
        localStorage.setItem('workouts',JSON.stringify(this.#workouts));
    }
    _toggleElevationField(){
        inputElevation.parentElement.classList.toggle('form__row--hidden');
        inputCadence.parentElement.classList.toggle('form__row--hidden');
    }
    _moveTo(e){
        const target=e.target.closest('.workout');
        if(!target)return;
        // console.log(typeof target.dataset.id,typeof this.#workouts[0].id);
        this.#map.flyTo(this.#workouts.find(workout=>workout.id===+target.dataset.id).coords, 16);
    }
}
const app=new App();










