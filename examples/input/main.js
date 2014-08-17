

var input = new RL.Input();

// key bindings: a list of actions bound to a list of keys to trigger them
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

// set a function to trigger functionality based on the input action triggered
input.onKeyAction = function(action){
    console.log(action);
    inputElement.innerHTML += action + '<br>';
};

// the Game class has a onKeyAction function that is used this way and automatically set look in the game.js code

