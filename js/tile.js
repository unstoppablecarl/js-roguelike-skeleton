(function(root) {
    'use strict';

    /**
    * Represents a tile in the game map
    * @class Tile
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of tile. When created this object is merged with the value of Tile.Types[type].
    * @param {Number} x - The map tile coordinate position of this tile on the x axis.
    * @param {Number} y - The map tile coordinate position of this tile on the y axis.
    */
    var Tile = function Tile(game, type, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;

        var typeData = Tile.Types[type];
        if(!typeData){
            throw new Error('TileType "' + type + '" not found.');
        }
        for(var key in typeData){
            this[key] = typeData[key];
        }

        // make sure "this" is always this Tile instance when calling bump
        this.bump = this.bump.bind(this);
    };

    Tile.prototype = {
        constructor: Tile,

        /**
        * Game instance this obj is attached to.
        *
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Tile.Types[type].
        * @property type
        * @type Object
        */
        type: null,

        /**
        * If this tile has been explored by the player.
        * @property explored
        * @type Bool
        */
        explored: false,

        /**
        * If entities can move through this tile.
        * @property passable
        * @type Bool
        */
        passable: false,

        /**
        * If this tile blocks line of sight.
        * @property passable
        * @type Bool
        */
        blocksLos: false,

        /**
        * The tile map coordinate position on the x axis.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The tile map coordinate position on the y axis.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this tile.
        * @property char
        * @type String
        */
        char: null,

        /**
        * The color of the character displayed when rendering this tile. Not rendered if false.
        * @property color
        * @type String|bool
        */
        color: null,

        /**
        * The background color the character displayed when rendering this tile. Not rendered if false.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        /**
        * Handles the behavior of a player or other entity attempting to move into this tile. Only used if this.passable = false.
        * @method bump
        * @param {Object} entity - The player or entity attemplting to move into this tile.
        */
        bump: function(entity){
            if(!this.passable){
                this.game.console.log('You cannot move through this <strong>' + this.name + '</strong> no matter how hard you try.');
            }
        },
    };

    /**
    * Describes different types of tiles. Used by the Tile constructor 'type' param.
    *
    *     Tile.Types = {
    *         floor: {
    *            name: 'Floor',
    *            char: '.',
    *            color: '#333',
    *            bgColor: '#111',
    *            passable: true,
    *            blocksLos: false
    *         },
    *         // ...
    *     }
    *
    * @class Tile.Types
    * @static
    */
    Tile.Types = {
        floor: {
            name: 'Floor',
            char: '.',
            color: '#333',
            bgColor: '#111',
            passable: true,
            blocksLos: false
        },
        wall: {
            name: 'Wall',
            char: '#',
            color: '#666',
            bgColor: '#222',
            passable: false,
            blocksLos: true
        },
        light: {
            name: 'Light',
            char: '+',
            color: '#fff',
            bgColor: '#333',
            passable: false,
            blocksLos: false
        },
        door: {
            name: 'Door',
            char: '+',
            color: 'yellow',
            bgColor: '#222',
            passable: false,
            blocksLos: true,
            bump: function(entity){
                if(!this.passable){
                    this.passable = true;
                    this.blocksLos = false;
                    this.char = "'";
                    this.game.console.log('You open the <strong>' + this.name + '</strong>.');

                }
            }
        }
    };

    root.RL.Tile = Tile;

}(this));
