
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

// get existing DOM elements
var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');

// append elements created by the game to the DOM
mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);


var lightPasses = function(x, y) {
    var tile = game.map.get(x, y);
    return tile && tile.passable;
};

var maxViewRadius = 10;
var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);

var getFov = function(x, y){
    fov.compute(x, y, maxViewRadius, function(x, y, range, visibility) {
        var ch = (r ? "" : "@");
        var color = (data[x+","+y] ? "#aa0": "#660");
        display.draw(x, y, ch, "#fff", color);
    });
};

game.onKeyAction = function(action) {
    this.player.update(action);
    this.entityManager.update();




    this.renderer.draw();
};
// start the game
game.start();




