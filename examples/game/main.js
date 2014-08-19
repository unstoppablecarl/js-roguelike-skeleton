
// create the game instance
var game = new RL.Game();

var mapData = [
    "#####################",
    "#.........#.........#",
    "#....Z.S..#....##...#",
    "#..P......+....##...#",
    "#.........#.........#",
    "#.#..#..#.#.........#",
    "#.........#...####+##",
    "#..+...+..#...#.....#",
    "#.........#...#.....#",
    "#.........#...#.....#",
    "#####################"
];

var mapCharToType = {
    '#': 'wall',
    '.': 'floor'
};

var entityCharToType = {
    'Z': 'zombie',
    'S': 'statue'
};

game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');
game.entityManager.loadEntitiesFromArrayString(mapData, entityCharToType);

// add some lights
game.map.set(3,14, new RL.Tile(game, 'light', 3, 14));
game.map.set(7,14, new RL.Tile(game, 'light', 7, 14));

var keyBindings = {
    up: ['UP_ARROW', 'K', 'W'],
    down: ['DOWN_ARROW', 'J', 'S'],
    left: ['LEFT_ARROW', 'H', 'A'],
    right: ['RIGHT_ARROW', 'L', 'D'],
};

// generate and assign a map object (repaces empty default)
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
