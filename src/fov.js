(function(root) {
    'use strict';

    /**
    * Represents a Fov in the game map. requires ROT.js
    * @class Fov
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    */
    var Fov = function Fov(game) {
        this.game = game;
        this.fovMap = new RL.Array2d();
    };

    Fov.prototype = {
        constructor: Fov,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Array2d storing fov visibility fovMap
        * @property fovMap
        * @type Array2d
        */
        fovMap: null,

        /**
        * Max visible distance in tiles
        * @property maxViewDistance
        * @type Number
        */
        maxViewDistance: 10,

        /**
        * Calculates the fov data relative to given coords;
        * @method update
        * @param {Number} x - The map coordinate position to calculate Fov from on the x axis.
        * @param {Number} y - The map coordinate position to calculate Fov from on the y axis.
        * @param {Number} [maxViewDistance] - Max visible distance (this.maxViewDistance used if not set).
        * @param {Array2d} [map=this.game.map] - The map to check the fov of.
        */
        update: function(x, y, maxViewDistance, map){
            map = map || this.game.map;
            if(maxViewDistance === void 0){
                maxViewDistance = this.maxViewDistance;
            }

            this.fovMap.reset();

            var radius = maxViewDistance,
                i, j;

            for (i = -radius; i <= radius; i++){
                for (j = -radius; j <= radius; j++){
                    if(i * i + j * j < radius * radius){
                        var x2 = x + i,
                            y2 = y + j,
                            visible = this.checkLos(x, y, x2, y2);
                        if(visible){
                            var tile = map.get(x2, y2);
                            // mark all drawn tiles as explored
                            tile.explored = true;
                            this.fovMap.set(x2, y2, 1);
                        }
                    }
                }
            }
        },

        /**
        * Retrieves the visibility of the tile at given coords
        * @method get
        * @param {Number} x - The x map tile coordinate to get Fov visibility of.
        * @param {Number} y - The y map tile coordinate to get Fov visibility of.
        */
        get: function(x, y){
            return this.fovMap.get(x, y);
        },

        /**
        * Checks if an unobstructed line can be drawn from coords 0 to 1. Typically used for Line of Sight checks
        * @method checkLos
        * @param {Number} x0 - Start coord x.
        * @param {Number} y0 - Start coord y.
        * @param {Number} x1 - End coord x.
        * @param {Number} y1 - End coord y.
        * @param {Map} [map=this.game.map] - The Map object used when checking line of sight.
        * @param {Function} [canSeeThroughTileFunc] - A function that determines if a tile blocks line of sight, returning true if the map tile at the x,y coords provided blocks line of sight (function(x, y){ return true; }). If not set map.canSeeThroughTile(x,y) is used instead.
        */
        checkLos: function(x0, y0, x1, y1, map, canSeeThroughTileFunc){
            map = map || this.game.map;
            var sx, sy, xnext, ynext, dx, dy, denom, dist;
            dx = x1 - x0;
            dy = y1 - y0;
            if (x0 < x1){
                sx = 1;
            }
            else{
                sx = -1;
            }

            if (y0 < y1){
                sy = 1;
            }
            else{
                sy = -1;
            }
            // sx and sy are switches that enable us to compute the LOS in a single quarter of x/y plan
            xnext = x0;
            ynext = y0;
            denom = Math.sqrt(dx * dx + dy * dy);
            while (xnext != x1 || ynext != y1){
                if(canSeeThroughTileFunc !== void 0 && !canSeeThroughTileFunc(xnext, ynext)){
                    return false;
                }
                else if (!map.canSeeThroughTile(xnext, ynext)){
                    return false;
                }
                // Line-to-point distance formula < 0.5
                if(Math.abs(dy * (xnext - x0 + sx) - dx * (ynext - y0)) / denom < 0.5){
                    xnext += sx;
                }
                else if(Math.abs(dy * (xnext - x0) - dx * (ynext - y0 + sy)) / denom < 0.5){
                    ynext += sy;
                }
                else {
                    xnext += sx;
                    ynext += sy;
                }
            }
            return true;
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
