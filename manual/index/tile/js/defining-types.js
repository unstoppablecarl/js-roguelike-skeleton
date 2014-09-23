// types of tiles are defined by adding objects to the RL.Tile.Types objects
// each type has a typeName and is accessed like this RL.Tile.Types[typeName];
// methods on a tile type object override methods with the same name on an object instance ( var tile = new RL.Tile() ) ( RL.Tile.prototype )
// See tile.js to review the types available by default

RL.Tile.Types.pit = {
    name: 'Pit',
    char: 'O',
    color: '#333',
    bgColor: '#000',
    passable: false,
    blocksLos: false
};

var game; // new RL.Game();
var x = 0;
var y = 0;
var tile = new RL.Tile(game, 'pit', x, y);