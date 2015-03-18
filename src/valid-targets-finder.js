(function(root) {
    'use strict';

    /**
     * Gets a list of valid targets filtered by provided criteria.
     * @class ValidTargetsFinder
     * @constructor
     * @param {Game}         game
     * @param {Object}       settings
     * @param {Number}       settings.x                                  - The x map tile coord to use as the origin of the attack.
     * @param {Number}       settings.y                                  - The y map tile coord to use as the origin of the attack.
     * @param {FovROT}       [settings.limitToFov=false]                 - If set only targets within the given `FovROT` will be valid.
     * @param {Bool}         [settings.limitToNonDiagonalAdjacent=false] - If true diagonally adjacent targets are not valid (only used if `range = 1`).
     * @param {Number}       [settings.range=1]                          - Max distance in tiles target can be from origin.
     * @param {Array}        [settings.validTypes=Array]                 - Array of valid target object types. Checked using `target instanceof type`.
     * @param {Bool}         [settings.includeTiles=false]               - If true tile objects are can be valid targets.
     * @param {Object|Array} [settings.exclude=false]                    - Object or Array of objects to exclude from results.
     * @param {Bool}         [settings.prepareValidTargets=true]         - If true valid targets are wraped in an object with x, y, range, value properties.
     * @param {Function}     [settings.filter=false]                     - Function to filter objects when checking if they are valid. `function(obj){ return true }` . Targets must still be a valid type.
     */
    var ValidTargetsFinder = function(game, settings){
        this.game = game;

        settings = settings || {};

        this.x                          = settings.x                            || this.x;
        this.y                          = settings.y                            || this.y;
        this.limitToFov                 = settings.limitToFov                   || this.limitToFov;
        this.limitToNonDiagonalAdjacent = settings.limitToNonDiagonalAdjacent   || this.limitToNonDiagonalAdjacent;
        this.range                      = settings.range                        || this.range;
        this.validTypes                 = settings.validTypes                   || [];
        this.includeTiles               = settings.includeTiles                 || this.includeTiles;
        this.includeSelf                = settings.includeSelf                  || this.includeSelf;
        this.prepareValidTargets        = settings.prepareValidTargets          || this.prepareValidTargets;
        this.filter                     = settings.filter                       || this.filter;
    };

    ValidTargetsFinder.prototype = {
        constructor: ValidTargetsFinder,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type {Game}
        */
        game: null,

        /**
         * The x map tile coord to use as the origin of this target finder.
         * @property x
         * @type {Number}
         */
        x: null,

        /**
         * The y map tile coord to use as the origin of this target finder.
         * @property y
         * @type {Number}
         */
        y: null,

        /**
         * If set only targets within the given `FovROT` will be valid.
         * @property limitToFov
         * @type {FovROT}
         */
        limitToFov: false,

        /**
         * Limit results to non-diagonal adjacent tiles
         * @propery limitToNonDiagonalAdjacent
         * @type {Boolean}
         */
        limitToNonDiagonalAdjacent: false,

        /**
         * Max distance in tiles target can be from origin.
         * @property range
         * @type {Number}
         */
        range: 1,

        /**
         * Array of valid target object types. Checked using `target instanceof type`.
         * If set to an empty array or a value evaluating to false, all types are considered valid.
         * @property validTypes
         * @type {Array}
         */
        validTypes: null,

        /**
         * If true tile objects are can be valid targets.
         * @property includeTiles
         * @type {Boolean}
         */
        includeTiles: false,

        /**
         * If true valid targets are wraped in an object with x, y, range, value properties.
         * @property prepareValidTargets
         * @type {Boolean}
         */
        prepareValidTargets: true,

        /**
         * Function to filter objects when checking if they are valid. `function(obj){ return true }` .
         * Targets must still be an instance of this.validTypes.
         * @property filter
         * @type {Function}
         */
        filter: false,

        /**
         * Object or Array of objects to exclude from results.
         * @property exclude
         * @type {Object|Array}
         */
        exclude: null,

        /**
         * Gets all valid targets.
         * @method getValidTargets
         * @return {Array}
         */
        getValidTargets: function(){
            var tiles = this.getValidTargetTiles();
            var result = [];
            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                var targets = this.getValidTargetsAtPosition(tile.x, tile.y);
                result = result.concat(targets);
                if(this.includeTiles){
                    result.push(tile);
                }
            }
            return result;
        },

        /**
         * Get tile coords a valid target may be on. Only checking range and fov, not objects on the tile.
         * @method getValidTargetTiles
         * @return {Array} of Tile objects
         */
        getValidTargetTiles: function(){
            var tiles = [];
            if(this.limitToFov){
                var fovTiles = this.limitToFov.visibleTiles;
                for (var i = 0; i < fovTiles.length; i++) {
                    var fovTile = fovTiles[i];
                    // if no max range, if there is a max range check it
                    if(!this.range || fovTile.range <= this.range){

                        // if including tile objects in result but not preparing them
                        if(this.includeTiles && !this.prepareValidTargets){
                            fovTile = fovTile.value;
                        }
                        tiles.push(fovTile);
                    }
                }
            } else {
                var x = this.x,
                    y = this.y;

                if(this.range === 1){
                    if(this.limitToNonDiagonalAdjacent){
                        tiles = this.game.map.getAdjacent(x, y, {withDiagonals: false});
                    }
                    else{
                        tiles = this.game.map.getAdjacent(x, y);
                    }
                } else {
                    tiles = this.game.map.getWithinSquareRadius(x, y, {radius: this.range});
                }

                // if including tile objects, prepare them
                if(this.includeTiles && this.prepareValidTargets){
                    var _this = this;
                    tiles = tiles.map(function(tile){
                        return _this.prepareTargetObject(tile);
                    });
                }
            }
            return tiles;
        },

        /**
         * Get valid target objects on a tile coord.
         * @method getValidTargetsAtPosition
         * @param {Number} x - Map tile coord to get valid target objects from.
         * @param {Number} y - Map tile coord to get valid target objects from.
         * @return {Array} mixed objects
         */
        getValidTargetsAtPosition: function(x, y){
            var objects = this.game.getObjectsAtPostion(x, y);
            var range = RL.Util.getDistance(this.x, this.y, x, y);
            var _this = this;
            var filtered =  objects.filter(function(target){
                return _this.checkValidTarget(target);
            });

            return filtered.map(function(target){
                return _this.prepareTargetObject(target, x, y, range);
            });
        },

        /**
         * Wraps a target object in a container object with x, y, range
         * @method prepareTargetObject
         * @param {Object} target
         * @param {Number} [x=target.x]
         * @param {Number} [y=target.y]
         * @param {Number} [range] range from `this.x`, `this.y` to x,y
         * @return {Object} result result object
         *  `
         *  return {
         *      x: x, // target x tile coord
         *      y: y, // target y tile coord
         *      range: range, // distance to target
         *      value: target // target object
         *  };
         *  `
         * @return {Object} result.x target x tile coord
         * @return {Object} result.y target y tile coord
         * @return {Object} result.range distance to target
         * @return {Object} result.value target object
         */
        prepareTargetObject: function(target, x, y, range){
            x = x || target.x;
            y = y || target.y;
            range = range || RL.Util.getDistance(this.x, this.y, x, y);
            return {
                x: x,
                y: y,
                range: range,
                value: target
            };
        },

        /**
         * Checks if a target object is an instance of a type in `this.validTypes`.
         * @method checkValidType
         * @param {Object} target - The target to be checked.
         * @return {Bool} `true` if valid.
         */
        checkValidType: function(target){
            // skip valid type check if value evaluating to false or empty array.
            if(!this.validTypes || !this.validTypes.length){
                return true;
            }

            for(var i = this.validTypes.length - 1; i >= 0; i--){
                var type = this.validTypes[i];
                if(target instanceof type){
                    return true;
                }
            }

            // no valid type match found
            return false;
        },

        /**
         * Checks if an object is a valid target for this action.
         * @method checkValidTarget
         * @param {Object} target - The target to be checked.
         * @return {Bool} `true` if valid.
         */
        checkValidTarget: function(target){
            if(this.exclude){
                if(target === this.exclude){
                    return false;
                }
                // if exclude is array and target is in it
                if(Object.isArray(this.exclude) && this.exclude.indexOf(target) !== -1){
                    return false;
                }
            }
            if(!this.checkValidType(target)){
                return false;
            }
            if(this.filter && !this.filter(target)){
                return false;
            }

            return true;
        },
    };

    root.RL.ValidTargetsFinder = ValidTargetsFinder;

}(this));