(function(root) {
    'use strict';

    /**
    * Represents a Fov in the game map. requires ROT.js
    * @class Fov
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    */
    var Fov = function Fov(game) {
        this.game = game;
        this.fovMap = new RL.Array2d();
        this.checkVisible = this.checkVisible.bind(this);

        this._fov = new ROT.FOV.PreciseShadowcasting(this.checkVisible);

    };

    Fov.prototype = {
        constructor: Fov,

        /**
        * Game instance this obj is attached to.
        *
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Array2d storing fov visibility fovMap
        *
        * @property fovMap
        * @type Array2d
        */
        fovMap: null,

        /**
        * Max visible distance in tiles
        *
        * @property maxSightRange
        * @type Number
        */
        maxSightRange: 10,

        /**
        * ROT.FOV instance
        *
        * @property _fov
        * @private
        * @type ROT.FOV
        */
        _fov: null,

        /**
        * Calculates the fov data relative to given coords;
        * @method update
        * @param {Number} x - The map coordinate position to calculate Fov from on the x axis.
        * @param {Number} y - The map coordinate position to calculate Fov from on the y axis.
        */
        update: function(x, y){
            this.fovMap.reset();
            var _this = this;
            this._fov.compute(x, y, this.maxSightRange, function(x, y, range, visibility){

                //set tile to explored
                var tile = _this.game.map.get(x, y);
                tile.explored = true;

                _this.fovMap.set(x, y, visibility);
            });
        },

        /**
        * Retrieves the visibility of the tile at given coords
        * @method get
        * @param {Number} x - The map coordinate position to get Fov visibility from on the x axis.
        * @param {Number} y - The map coordinate position to get Fov visibility from on the y axis.
        */
        get: function(x, y){
            return this.fovMap.get(x, y);
        },

        /**
        * Checks if a tile blocks line of sight
        * @method checkVisible
        */
        checkVisible: function(x, y){
            var tile = this.game.map.get(x, y);
            return tile && !tile.blocksLos;
        },

        /**
        * Sets the size of the map to mange fov within.
        * @method setSize
        * @param {Number} width - Width of current map in tiles.
        * @param {Number} height - Height of current map in tiles.
        */
        setSize: function(width, height){
            this.fovMap.setSize(width, height);
        }

    };

    root.RL.Fov = Fov;

}(this));
