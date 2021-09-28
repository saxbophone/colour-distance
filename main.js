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

function handleRootColourInput(event) {
    updateRootColour(event.target.value);
    updateRootColourDisplay();
    updateColourGridBorder();
}

function handleRootColourChange(event) {
    updateRootColour(event.target.value);
    updateRootColourDisplay();
    updateColourGridBorder();
}

function handleDistanceInput(event) {
    updateDistance(event.target.value);
    updateDistanceDisplay();
}

function handleDistanceChange(event) {
    updateDistance(event.target.value);
    updateDistanceDisplay();
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
    rootColourElement.disabled = false;
    distanceElement.disabled = false;
    // update display of both inputs' values
    rootColour = rootColourElement.value;
    distance = parseInt(distanceElement.value);
    updateRootColourDisplay();
    updateDistanceDisplay();
    updateColourGridBorder();
}

window.addEventListener('load', startup, false);
