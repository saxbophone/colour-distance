function updateRootColourDisplay() {
    let rootColourElement = document.querySelector('#root-colour');
    document.querySelector('#root-colour-hex').innerHTML = rootColourElement.value;
}

function updateDistanceDisplay() {
    let distanceElement = document.querySelector('#distance');
    document.querySelector('#distance-value').innerHTML = distanceElement.value;
}

function handleRootColourInput(event) {
    /*
     * hmmm, we ignore the event and do a query for the element value in the
     * function call (even though we could get it from the event).
     * Wasteful?
     */
    updateRootColourDisplay();
}

function handleRootColourChange(event) {
    /*
     * hmmm, we ignore the event and do a query for the element value in the
     * function call (even though we could get it from the event).
     * Wasteful?
     */
    updateRootColourDisplay();
}

function handleDistanceInput(event) {
    /*
     * hmmm, we ignore the event and do a query for the element value in the
     * function call (even though we could get it from the event).
     * Wasteful?
     */
    updateDistanceDisplay();
}

function handleDistanceChange(event) {
    /*
     * hmmm, we ignore the event and do a query for the element value in the
     * function call (even though we could get it from the event).
     * Wasteful?
     */
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
    updateRootColourDisplay();
    updateDistanceDisplay();
}

window.addEventListener('load', startup, false);
