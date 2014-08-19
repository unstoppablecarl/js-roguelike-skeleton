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
        * @param {Array} x - The array of strings to load.
        * @param {Object} charToType - An object mapping string characters to Tile types (see Tile.Types[type]).
        * @example

            var mapData = [
                '####',
                '#..#',
                '#..#',
                '####',
            ],
            // 'wall'
            charToType = {
                '#': 'wall',
                '.': 'floor'
            };
            map.loadTilesFromArrayString(mapData, charToType);
        *
        */
        loadTilesFromArrayString: function(mapData, charToType){
            var width = mapData[0].length,
                height = mapData.length;

            this.width = width;
            this.height = height;
            this.reset();

            // loop over each coord in the Array2d (val will be undefined)
            this.each(function(val, x, y){
                var char = mapData[y][x],
                    type = charToType[char],
                    tile = new RL.Tile(this.game, type, x, y);
                this.add(x, y, tile);
            });
        }
    };

    /*
        Object inheritance is on the list of non-beginner
        techniques to be avoided. An exception is made here
        to avoid copying all Array2d methods
    */
    for(var key in RL.Array2d.prototype){
        if(Map.prototype[key] === void 0){
            Map.prototype[key] = RL.Array2d.prototype[key];
        }
    }

    root.RL.Map = Map;

}(this));