var input = new RL.Input();

// key bindings: a list of actions bound to a list of keys to trigger them
// see Input.Keys in input.js for a full list of key names available.
var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D'],
    attack: ['SPACE'],
};

// add input keybindings
input.addBindings(keyBindings);

// element to show the actions triggered
var inputElement = document.getElementById('input-actions');

// clear the element
inputElement.innerHTML = '';

// set a function to trigger functionality based on the input action triggered
input.onKeyAction = function(action){
    console.log(action);
    inputElement.innerHTML += '<div>' + action + '</div>';

    // remove the first element if there are more than 5
    if(inputElement.childElementCount > 5){
        inputElement.removeChild(inputElement.children[0]);
    }
};

// The Game class has an onKeyAction function that is used this way and is automatically set by the game constructor.
// See Game.prototype.onKeyAction in game.js
