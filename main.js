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

const gridSize = 25;
// these global variables track our input state
let rootColour = ''; // hex colour string
let distance = NaN; // number
let enableRGBOnly = false;
const DISTANCE_MIN = 0;
const DISTANCE_MAX = 206;

function updateRootColour(colour) {
    // TODO: validation
    rootColour = colour;
}

function updateDistance(d) {
    // validate new value before setting it
    let c = parseFloat(d);
    if (!isNaN(c) && DISTANCE_MIN <= c && c <= DISTANCE_MAX) {
        distance = c;
    }
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
    document.querySelector('#distance').value = distance.toString();
    document.querySelector('#distance-value').value = distance.toString();
}

function lockInputs() {
    document.querySelector('#root-colour').disabled = true;
    document.querySelector('#distance').disabled = true;
    document.querySelector('#distance-value').disabled = true;
    document.querySelector('#enable-rgb-only').disabled = true;
}

function unlockInputs() {
    document.querySelector('#root-colour').disabled = false;
    document.querySelector('#distance').disabled = false;
    document.querySelector('#distance-value').disabled = false;
    document.querySelector('#enable-rgb-only').disabled = false;
}

function updateColourGrid() {
    let colours = getDifferentColours(rootColour, enableRGBOnly, distance, gridSize);
    // XXX: this relies upon colours having gridSize elements as well as the table
    for (let i = 0; i < gridSize; i++) {
        let td = document.querySelector(`#derived-colour-${i.toString()}`);
        if (colours != null && colours[i]) {
            // disable placeholder background colour
            td.classList.toggle('empty-colour-square', false);
            // set background colour
            td.style.backgroundColor = colours[i].rgb.toString();
            // set RGB colour name text
            td.children[0].innerHTML = colours[i].rgb.toString();
            // set wavy underline on RGB colour text if RGB is approximation of LAB
            td.children[0].classList.toggle('inexact-colour', !colours[i].rgb.isExact);
            // set LAB colour name text
            td.children[1].innerHTML = colours[i].toString();
        } else {
            // enable placeholder background colour
            td.classList.toggle('empty-colour-square', true);
            // clear RGB colour name text
            td.children[0].innerHTML = '';
            // clear wavy underline on RGB colour text
            td.children[0].classList.toggle('inexact-colour', false);
            // clear LAB colour name text
            td.children[1].innerHTML = '';
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

function handleDistanceValueInput(event) {
    updateDistance(event.target.value);
    updateColourGrid();
}

function handleDistanceValueChange(event) {
    // lockInputs();
    updateDistance(event.target.value);
    updateDistanceDisplay();
    updateColourGrid();
    // unlockInputs();
}

function handleRGBOnlyChange(event) {
    // lockInputs();
    // overly pedantic boolean cast
    enableRGBOnly = event.target.checked ? true : false;
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
    let distanceValueElement = document.querySelector('#distance-value');
    let RGBOnlyElement = document.querySelector('#enable-rgb-only');
    // assign event handlers to their input and change events
    rootColourElement.addEventListener('input', handleRootColourInput, false);
    rootColourElement.addEventListener('change', handleRootColourChange, false);
    distanceElement.addEventListener('input', handleDistanceInput, false);
    distanceElement.addEventListener('change', handleDistanceChange, false);
    distanceValueElement.addEventListener('input', handleDistanceValueInput, false);
    distanceValueElement.addEventListener('change', handleDistanceValueChange, false);
    RGBOnlyElement.addEventListener('change', handleRGBOnlyChange, false);
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
