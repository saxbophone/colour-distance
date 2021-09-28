function handleRootColourInput(event) {
    console.log(`Root Colour Input "${event.target.value}"`);
}

function handleRootColourChange(event) {
    console.log(`Root Colour Change "${event.target.value}"`);
}

function handleDistanceInput(event) {
    console.log(`Distance Input "${event.target.value}"`);
}

function handleDistanceChange(event) {
    console.log(`Distance Change "${event.target.value}"`);
}

function setupEventHandlers() {
    // grab our two input elements
    var rootColourElement = document.querySelector("#root-colour");
    var distanceElement = document.querySelector("#distance");
    // assign event handlers to their input and change events
    rootColourElement.addEventListener('input', handleRootColourInput, false);
    rootColourElement.addEventListener('change', handleRootColourChange, false);
    distanceElement.addEventListener('input', handleDistanceInput, false);
    distanceElement.addEventListener('change', handleDistanceChange, false);
}

window.addEventListener('load', setupEventHandlers, false);
