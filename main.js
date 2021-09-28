/*
 * Colour Distance
 * Copyright (C) 2021 Joshua Saxby
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License v3
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { default as getDifferentColours } from './get-different-colours.js';

// these global variables track our input state
var rootColour = ''; // hex colour string
var distance = NaN; // number

function updateRootColour(colour) {
    // TODO: validation
    rootColour = colour;
}

function updateDistance(d) {
    // TODO: validation
    distance = parseInt(d);
}

function updateRootColourDisplay() {
    document.querySelector('#root-colour-hex').innerHTML = rootColour;
}

function updateColourGridBorder() {
    for (let td of document.querySelectorAll('#colour-board td')) {
        td.style.borderColor = rootColour;
    }
}

function updateDistanceDisplay() {
    document.querySelector('#distance-value').innerHTML = distance.toString();
}

function lockInputs() {
    document.querySelector('#root-colour').disabled = true;
    document.querySelector('#distance').disabled = true;
}

function unlockInputs() {
    document.querySelector('#root-colour').disabled = false;
    document.querySelector('#distance').disabled = false;
}

function updateColourGrid() {
    let colours = getDifferentColours(rootColour, distance, 16);
    // XXX: this relies upon colours having 16 elements as well as the table
    for (let i = 0; i < 16; i++) {
        let td = document.querySelector(`#derived-colour-${i.toString()}`);
        if (colours != null && colours[i]) {
            // disable placeholder background colour
            td.classList.toggle('empty-colour-square', false);
            // set background colour
            td.style.backgroundColor = colours[i];
            // set colour name text
            td.firstElementChild.innerHTML = colours[i];
        } else {
            // enable placeholder background colour
            td.classList.toggle('empty-colour-square', true);
            // clear colour name text
            td.firstElementChild.innerHTML = '';
        }
    }
}

function handleRootColourInput(event) {
    updateRootColour(event.target.value);
    updateRootColourDisplay();
    updateColourGridBorder();
    updateColourGrid();
}

function handleRootColourChange(event) {
    // lockInputs();
    updateRootColour(event.target.value);
    updateRootColourDisplay();
    updateColourGridBorder();
    updateColourGrid();
    // unlockInputs();
}

function handleDistanceInput(event) {
    updateDistance(event.target.value);
    updateDistanceDisplay();
    updateColourGrid();
}

function handleDistanceChange(event) {
    // lockInputs();
    updateDistance(event.target.value);
    updateDistanceDisplay();
    updateColourGrid();
    // unlockInputs();
}

function haveJavaScript() {
    // remove "no JavaScript" warning message
    document.querySelector('#no-javascript').remove();
}

window.addEventListener('DOMContentLoaded', haveJavaScript, false);

function startup() {
    // grab our two input elements
    let rootColourElement = document.querySelector('#root-colour');
    let distanceElement = document.querySelector('#distance');
    // assign event handlers to their input and change events
    rootColourElement.addEventListener('input', handleRootColourInput, false);
    rootColourElement.addEventListener('change', handleRootColourChange, false);
    distanceElement.addEventListener('input', handleDistanceInput, false);
    distanceElement.addEventListener('change', handleDistanceChange, false);
    // enable the input elements
    unlockInputs();
    // update display of both inputs' values
    rootColour = rootColourElement.value;
    distance = parseInt(distanceElement.value);
    updateRootColourDisplay();
    updateDistanceDisplay();
    updateColourGridBorder();
    updateColourGrid();
}

window.addEventListener('load', startup, false);
