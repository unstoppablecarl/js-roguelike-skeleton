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