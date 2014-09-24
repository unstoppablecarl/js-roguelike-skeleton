/*
    Types of tiles are defined by adding objects to the RL.Tile.Types object.
    Each type has a typeName and is accessed like this RL.Tile.Types[typeName];
    When creating a new Tile() object the second param is the typeName ( var tile = new RL.Tile(game, type, x, y) ).
    Methods on a tile type object are added to tile object instances of that type replacing methods with the same name
    See tile.js to review the types available by default.
*/

RL.Tile.Types.pit = {
    name: 'Pit',
    char: 'O',
    color: '#333',
    bgColor: '#000',
    passable: true,
    blocksLos: false,
    // when an entity enters this tile it is instantly killed
    onEntityEnter: function(entity){
        entity.dead = true;
    }
};

var game = null; // left null for simplicity of example. normally an instance of RL.Game
var x = 0;
var y = 0;
var pitTile = new RL.Tile(game, 'pit', x, y);