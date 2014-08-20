(function(root) {
    'use strict';

    /**
    * Represents a FovROT in the game map. requires ROT.js
    * @class FovROT
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    */
    var FovROT = function FovROT(game) {
        this.game = game;
        this.fovMap = new RL.Array2d();
        this.checkMapTileVisible = this.checkMapTileVisible.bind(this);
        this._fov = new ROT.FOV.RecursiveShadowcasting(this.checkMapTileVisible);
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
        * @property fieldRange
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
        * Validates a fieldRange value.
        * @method validateFieldRange
        * @param {Number} fieldRange - Field Range of view 90, 180, or 360.
        */
        validateFieldRange: function(fieldRange){
            var validRanges = [90, 180, 360];
            if(validRanges.indexOf(fieldRange) === -1){
                throw new Error('fieldRange must be one of: ' + validRanges.join(','));
            }
        },

        /**
        * Converts a string direction to an rot
        * @method directionStringToArray
        * @param {String} direction - Direction of fov (used as default) (not used for fieldRange 360) valid directions: ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'].
        * @return {Array} [x, y]
        */
        directionStringToArray: function(direction){
            var validDirections = ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'];
            if(validDirections.indexOf(direction) === -1){
                throw new Error('direction must be one of: ' + validDirections.join(','));
            }
            var dirs = {
                up:           [ 0, -1],
                up_right:     [ 1, -1],
                right:        [ 1,  0],
                down_right:   [ 1,  1],
                down:         [ 0,  1],
                down_left:    [-1,  1],
                left:         [-1,  0],
                up_left:      [-1, -1]
            };
            return dirs[direction];
        },

        /**
        * Calculates the fovROT data relative to given coords;
        * @method update
        * @param {Number} x - The map coordinate position to calculate FovROT from on the x axis.
        * @param {Number} y - The map coordinate position to calculate FovROT from on the y axis.
        * @param {Number} [fieldRange = 360] - Field Range of view 90, 180, or 360.
        * @param {String|ROT.DIRS[8].x} [direction = 'up'] - Direction of fov (not used for fieldRange 360) valid directions: ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'];.
        * @param {Number} [maxViewDistance] - Max visible distance in tiles. (this.maxViewDistance used if not set)
        */
        update: function(x, y, fieldRange, direction, maxViewDistance){
            if(fieldRange === void 0){
                fieldRange = this.fieldRange;
            }

            if(direction === void 0){
                direction = this.directionStringToArray(this.direction);
            } else {
                if(typeof direction === 'string'){
                    direction = this.directionStringToArray(direction);
                }
            }

            if(maxViewDistance === void 0){
                maxViewDistance = this.maxViewDistance;
            }

            this.validateFieldRange(fieldRange);

            this.fovMap.reset();

            var _this = this;

            var checkVisibleFunc = function(x, y, range, visibility){
                if(visibility){
                    var tile = _this.game.map.get(x, y);
                    if(tile){
                        tile.explored = true;
                    }
                }
                _this.fovMap.set(x, y, visibility);
            };

            if(fieldRange === 360){
                this._fov.compute(x, y, maxViewDistance, checkVisibleFunc);
            }
            else {
                if(fieldRange === 180){
                    this._fov.compute180(x, y, maxViewDistance, direction, checkVisibleFunc);
                }
                else if(fieldRange === 90){
                    this._fov.compute90(x, y, maxViewDistance, direction, checkVisibleFunc);
                }
            }
        },

        /**
        * Retrieves the visibility of the tile at given coords
        * @method get
        * @param {Number} x - The map coordinate position to get FovROT visibility from on the x axis.
        * @param {Number} y - The map coordinate position to get FovROT visibility from on the y axis.
        * @return {Bool}
        */
        get: function(x, y){
            return this.fovMap.get(x, y);
        },

        /**
        * Checks if a tile blocks line of sight
        * @method checkMapTileVisible
        * @return {Bool}
        */
        checkMapTileVisible: function(x, y){
            return this.game.map.canSeeThroughTile(x, y);
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
