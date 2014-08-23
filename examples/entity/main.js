
var initBasicGame = function(mapContainerEl, mapData){

    var keyBindings = {
        up: ['UP_ARROW', 'K', 'W'],
        down: ['DOWN_ARROW', 'J', 'S'],
        left: ['LEFT_ARROW', 'H', 'A'],
        right: ['RIGHT_ARROW', 'L', 'D'],
        wait: ['SPACE']
    };

    var mapCharToType = {
        '#': 'wall',
        '.': 'floor'
    };

    // create the game instance
    var game = new RL.Game();
    // generate and assign a map object (repaces empty default)

    game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');

    game.setMapSize(game.map.width, game.map.height);

    // add input keybindings
    game.input.addBindings(keyBindings);

    // set player starting position
    game.player.x = 5;
    game.player.y = 3;

    // make the view a little smaller
    game.renderer.resize(14, 14);

    // append elements created by the game to the DOM
    mapContainerEl.appendChild(game.renderer.canvas);

    window.game = game;
    return game;
};




