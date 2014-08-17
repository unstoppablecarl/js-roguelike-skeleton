
// simple map generator to get you started
var generateMap = function() {
    var map = new RL.Array2d(20, 20);
    for (var x = map.width - 1; x >= 0; x--) {
        for (var y = map.height - 1; y >= 0; y--) {
            var tileType;
            if (x === 0 || x === map.width - 1 || y === 0 || y === map.height - 1) {
                tileType = 'wall';

            } else {
                tileType = 'floor';
            }

            var tile = new RL.Tile(game, tileType, x, y);
            map.set(x, y, tile);
        }
    }

    var x = 10;
    for (var y = map.height - 1; y >= 0; y--) {

        var tile;
        if(y === 6){
            tile = new RL.Tile(game, 'door', x, y);
        } else {
            tile = new RL.Tile(game, 'wall', x, y);
        }

        map.set(x, y, tile);
    }

    map.set(8,12, new RL.Tile(game, 'wall', 8, 12));
    map.set(5,12, new RL.Tile(game, 'wall', 5, 12));
    map.set(2,12, new RL.Tile(game, 'wall', 2, 12));

    map.set(3,14, new RL.Tile(game, 'light', 3, 14));
    map.set(7,14, new RL.Tile(game, 'light', 7, 14));

    return map;
};

var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D'],
};

// create the game instance
var game = new RL.Game();

// generate and assign a map object (repaces empty default)
game.map = generateMap();

game.setMapSize(game.map.width, game.map.height);

// add input keybindings
game.input.addBindings(keyBindings);

// create entities and add to game.entityManager
var entZombie = new RL.Entity(game, 'zombie');
game.entityManager.add(3, 7, entZombie);

var entStatue = new RL.Entity(game, 'statue');
game.entityManager.add(5, 5, entStatue);

// set player starting position
game.player.x = 3;
game.player.y = 3;

game.lighting.set(3, 14, 255, 0, 0);
game.lighting.set(7, 14, 0, 0, 255);

// get existing DOM elements
var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');

// append elements created by the game to the DOM
mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);

game.console.log('The game starts.');
// start the game
game.start();




