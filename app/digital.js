
import { preferences } from "user-settings";
import document from "document";

import * as utils from "../common/utils";

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

let clockHour = document.getElementById('clock-hour');
let clockMin = document.getElementById('clock-min');
let clockSec = document.getElementById('clock-sec');

let clockWD = document.getElementById('clock-wd');
let clockMonth = document.getElementById('clock-month');
let clockYear = document.getElementById('clock-year');
let clockDay = document.getElementById('clock-day');

// Rotate the hands every tick
export function update(today) {  
    let hours = utils.zeroPad(today.getHours());
  
    if(preferences.clockDisplay == '12h') {
      hours = today.getHours() > 12 ?
      today.getHours() % 12 :
      today.getHours();
    }
  
    clockHour.text = hours;
    clockMin.text = utils.zeroPad(today.getMinutes());
    clockSec.text = utils.zeroPad(today.getSeconds());
    
    clockYear.text = today.getFullYear();
    clockDay.text = utils.zeroPad(today.getDate());
    clockWD.text = days[today.getDay()];
    clockMonth.text = months[today.getMonth()];
}