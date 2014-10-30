(function(root) {
    'use strict';

    /**
    * Manages map Tiles. Depends on Array2d (array-2d.js).
    * @class Map
    * @extends Array2d
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    */
    var Map = function Map(game) {
        this.game = game;
    };

    Map.prototype = {
        constructor: Map,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Sets a value at given coords.
        * @method set
        * @param {Number} x - Position on the x axis of the value being set.
        * @param {Number} y - Position on the y axis of the value being set.
        * @param {Tile|String} tile - The Tile being set at given coords. If Tile is a string a new tile will be created using the string as the Tile Type (see Tile.Types[type]).
        * @return {Tile} the tile added
        */
        set: function(x, y, tile) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return;
            }
            if(typeof tile === 'string'){
                tile = new RL.Tile(this.game, tile, x, y);
            }
            this.data[x][y] = tile;
            return tile;
        },

        /**
        * Checks if a map tile can be seen through.
        * @method canSeeThroughTile
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        canSeeThroughTile: function(x, y){
            var tile = this.get(x, y);
            return tile && !tile.blocksLos;
        },

        /**
        * Checks if a map tile can be moved through.
        * @method canMoveThroughTile
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        canMoveThroughTile: function(x, y){
            var tile = this.get(x, y);
            return tile && tile.passable;
        },

        /**
        * Loads Tile data from an array of strings
        * @method loadTilesFromArrayString
        * @param {Array} mapData - The array of strings to load.
        * @param {Object} charToType - An object mapping string characters to Tile types (see Tile.Types[type]).
        * @param {String} [defaultTileType] - The tile type to use if a character is not in charToType. This is used to allow characters representing entites or non-tile objects to be included in the mapData.
        * @example

            // 'P' will be ignored and a floor tile will be placed at that position
            var mapData = [
                '####',
                '#..#',
                '#.P#',
                '####',
            ],

            charToType = {
                '#': 'wall',
                '.': 'floor'
            },
            defaultTileType = 'floor';

            map.loadTilesFromArrayString(mapData, charToType, defaultTileType);
        *
        */
        loadTilesFromArrayString: function(mapData, charToType, defaultTileType){
            var _this = this,
                width = mapData[0].length,
                height = mapData.length;

            this.width = width;
            this.height = height;
            this.reset();

            // loop over each coord in the Array2d (val will be undefined)
            this.each(function(val, x, y){
                var char = mapData[y][x],
                    type = charToType[char];
                if(type === void 0 && defaultTileType){
                    type = defaultTileType;
                }
                var tile = new RL.Tile(_this.game, type, x, y);
                _this.set(x, y, tile);
            });
        }
    };

    Map.prototype = RL.Util.merge({}, RL.Array2d.prototype, Map.prototype);

    root.RL.Map = Map;

}(this));