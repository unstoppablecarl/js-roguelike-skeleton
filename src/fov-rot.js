(function(root) {
    'use strict';

    /**
    * Represents a FovROT in the game map. requires ROT.js
    * @class FovROT
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    */
    var FovROT = function FovROT(game) {
        this.game = game;
        this.fovMap = new RL.Array2d();
        this.visibleTiles = [];
        this.visibleTileKeys = [];
    };

    FovROT.prototype = {
        constructor: FovROT,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Array2d storing fovROT visibility fovMap
        * @property fovMap
        * @type Array2d
        */
        fovMap: null,

        /**
        * Field Range of view 90, 180, or 360.
        * @property fieldRange
        * @type Number
        */
        fieldRange: 360,

        /**
        * Direction of fov (used as default) (not used for fieldRange 360) valid directions: ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'].
        * @property direction
        * @type String
        */
        direction: 'up',

        /**
        * Max visible distance in tiles
        * @property maxViewDistance
        * @type Number
        */
        maxViewDistance: 10,

        /**
         * All visible map tiles
         * Array of objects: {x: null, y: null, tile: null, range: null}
         * @property visibleTiles
         * @type {Array}
         */
        visibleTiles: null,

        /**
         * Array of visible tile keys used to prevent duplicates in this.visibleTiles.
         * @property visibleTileKeys
         * @type {Array}
         * @private
         */
        visibleTileKeys: null,

        /**
        * Validates a fieldRange value.
        * @method validateFieldRange
        * @param {Number} fieldRange - Field Range of view valid values: `90`, `180`, or `360`.
        */
        validateFieldRange: function(fieldRange){
            var validRanges = [90, 180, 360];
            if(validRanges.indexOf(fieldRange) === -1){
                throw new Error('fieldRange must be one of: ' + validRanges.join(','));
            }
        },

        /**
        * Converts a string direction to an rot direction
        * @method directionStringToArray
        * @param {String} direction - Direction of fov (used as default) (not used for fieldRange 360) valid directions: ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'].
        * @return {Array} [x, y]
        */
        directionStringToArray: function(direction){
            var coord = RL.Util.getOffsetCoordsFromDirection(direction);
            return [coord.x, coord.y];
        },

        /**
        * Calculates the fovROT data relative to given coords.
        * @method update
        * @param {Number} x - The map coordinate position to calculate FovROT from on the x axis.
        * @param {Number} y - The map coordinate position to calculate FovROT from on the y axis.
        * @param {Number} [fieldRange = this.fieldRange || 360] - Field Range of view 90, 180, or 360.
        * @param {String|ROT.DIRS[8].x} [direction = this.direction || 'up'] - Direction of fov (not used for fieldRange 360) valid directions: ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'];.
        * @param {Number} [maxViewDistance = this.maxViewDistance] - Max visible distance in tiles.
        * @param {Entity} [entity] - The entity to check tile visibility with.
        */
        update: function(x, y, fieldRange, direction, maxViewDistance, entity){

            if(fieldRange === void 0){
                fieldRange = this.fieldRange;
            }

            if(direction === void 0){
                direction = this.direction;
            }

            if(fieldRange !== 360 && typeof direction === 'string'){
                direction = this.directionStringToArray(direction);
            }
            this.direction = direction;
            if(maxViewDistance === void 0){
                maxViewDistance = this.maxViewDistance;
            }

            this.validateFieldRange(fieldRange);

            this.visibleTiles = [];
            this.visibleTileKeys = [];
            this.fovMap.reset();
            var entityCanSeeThrough = this.getEntityCanSeeThroughCallback(entity);
            var fov = new ROT.FOV.RecursiveShadowcasting(entityCanSeeThrough);

            var setMapTileVisible = this.setMapTileVisible.bind(this);

            if(fieldRange === 360){
                fov.compute(x, y, maxViewDistance, setMapTileVisible);
            }
            else {
                if(fieldRange === 180){
                    fov.compute180(x, y, maxViewDistance, direction, setMapTileVisible);
                }
                else if(fieldRange === 90){
                    fov.compute90(x, y, maxViewDistance, direction, setMapTileVisible);
                }
            }
        },

        /**
        * Retrieves the visibility of the tile at given coords
        * @method get
        * @param {Number} x - The map coord position to get FovROT visibility from.
        * @param {Number} y - The map coord position to get FovROT visibility from.
        * @return {Bool}
        */
        get: function(x, y){
            return this.fovMap.get(x, y);
        },

        /**
        * Checks if a tile blocks line of sight
        * @method entityCanSeeThrough
        * @param {Entity} entity - The entity to make a callback for.
        * @return {Function}
        */
        getEntityCanSeeThroughCallback: function(entity){
            var game = this.game;
            return function(x, y){
                return game.entityCanSeeThrough(entity, x, y);
            };
        },

        /**
        * Sets the visibility of a checked map tile
        * @method setMapTileVisible
        * @param {Number} x - The map coord position to set.
        * @param {Number} y - The map coord position to set.
        * @param {Number} range - The distance from this fov origin.
        * @param {Number} visibility - The visibility of this tile coord.
        */
        setMapTileVisible: function(x, y, range, visibility){
            this.fovMap.set(x, y, visibility);
            if(visibility){
                var tile = this.game.map.get(x, y);
                if(tile){
                    var key = x + ',' + y;
                    // check for duplicates
                    if(this.visibleTileKeys.indexOf(key) === -1){
                        this.visibleTiles.push({
                            x: x,
                            y: y,
                            value: tile,
                            range: range
                        });
                        this.visibleTileKeys.push(key);
                    }
                }
            }
        },

        /**
        * Sets the size of the map to mange fovROT within.
        * @method setSize
        * @param {Number} width - Width of current map in tiles.
        * @param {Number} height - Height of current map in tiles.
        */
        setSize: function(width, height){
            this.fovMap.setSize(width, height);
        }

    };

    root.RL.FovROT = FovROT;

}(this));
