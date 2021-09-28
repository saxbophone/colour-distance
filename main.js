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
    setTimeout(
        function() {
            document.querySelector('#root-colour').disabled = false;
            document.querySelector('#distance').disabled = false;
        },
        300
    );
}

function handleRootColourInput(event) {
    updateRootColour(event.target.value);
    updateRootColourDisplay();
    updateColourGridBorder();
}

function handleRootColourChange(event) {
    lockInputs();
    updateRootColour(event.target.value);
    updateRootColourDisplay();
    updateColourGridBorder();
    unlockInputs();
}

function handleDistanceInput(event) {
    updateDistance(event.target.value);
    updateDistanceDisplay();
}

function handleDistanceChange(event) {
    lockInputs();
    updateDistance(event.target.value);
    updateDistanceDisplay();
    unlockInputs();
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
}

window.addEventListener('load', startup, false);
