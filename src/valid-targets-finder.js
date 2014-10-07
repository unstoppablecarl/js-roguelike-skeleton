(function(root) {
    'use strict';

    /**
     * Gets a list of valid targets for an action.
     * @class ValidTargetsFinder
     * @constructor
     * @param {Game}        game
     * @param {Entity}      entity
     * @param {Object}      [settings]
     * @param {Bool}        [settings.limitToFov=true]      - If true only targets within this.entity's fov will be valid.
     * @param {Number}      [settings.range=1]              - Max distance in tiles target can be from entity.
     * @param {Array}       [settings.validTypes=Array]     - Array of valid target object types. Checked using `target instanceof type`.
     * @param {Bool}        [settings.includeTiles=false]   - If true tile objects are can be valid targets.
     * @param {Bool}        [settings.includeSelf=false]    - If true entity may target themself.
     * @param {Function}    [settings.filter=false]         - Function to filter objects when checking if they are valid. `function(obj){ return true }` . Targets must still be a valid type.
     */
    var ValidTargetsFinder = function(game, entity, settings){
        this.game = game;
        this.entity = entity;

        settings = settings || {};

        this.limitToFov =   settings.limitToFov     || this.limitToFov;
        this.range =        settings.range          || this.range;
        this.validTypes =   settings.validTypes     || [];
        this.includeTiles = settings.includeTiles   || this.includeTiles;
        this.includeSelf =  settings.includeSelf    || this.includeSelf;
        this.filter =       settings.filter         || this.filter;
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
         * Entity to check valid targets from.
         * (Uses Entity#x, Entity#y, Entity#fov)
         * @property entity
         * @type {Entity}
         */
        entity: null,

        /**
         * If true to be valid a target must be in entity fov.
         * @property limitToFov
         * @type {Boolean}
         */
        limitToFov: true,

        /**
         * Max distance in tiles target can be from entity.
         * @property range
         * @type {Number}
         */
        range: 1,

        /**
         * Array of valid target object types. Checked using `target instanceof type`.
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
         * If true entity may target themself.
         * @property includeSelf
         * @type {Boolean}
         */
        includeSelf: false,

        /**
         * Function to filter objects when checking if they are valid. `function(obj){ return true }` .
         * Targets must still be an instance of this.validTypes.
         * @property filter
         * @type {Function}
         */
        filter: false,

        /**
         * Gets all valid targets for this action from position of this.entity
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
         * Get tile coords a valid target may be on. Only checking range and entity fov, not objects on the tile.
         * @method getValidTargetTiles
         * @return {Array} of Tile objects
         */
        getValidTargetTiles: function(){
            var tiles = [];
            if(this.limitToFov){
                var fovTiles = this.entity.fov.visibleTiles;
                for (var i = 0; i < fovTiles.length; i++) {
                    var fovTile = fovTiles[i];
                    // if no max range, if there is a max range check it
                    if(!this.range || fovTile.range <= this.range){
                        tiles.push(fovTile);
                    }
                }
            } else {
                var x = this.entity.x,
                    y = this.entity.y;
                tiles = this.game.map.getWithinSquareRadius(x, y, this.range);

                var _this = this;
                tiles = tiles.map(function(tile){
                    return _this.prepareTargetObject(tile);
                });
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
            var range = RL.Util.getTileDistance(this.entity.x, this.entity.y, x, y, true);
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
         * @param {Number} [range] range from this.entity to x,y
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
            range = range || RL.Util.getTileDistance(this.entity.x, this.entity.y, x, y, true);
            return {
                x: x,
                y: y,
                range: range,
                value: target
            };
        },

        /**
         * Checks if an object is a valid target for this action.
         * @method checkValidTarget
         * @param {Object} target - target to be checked
         * @return {Bool} true if valid
         */
        checkValidTarget: function(target){
            if(!this.includeSelf && target === this.entity){
                return false;
            }
            for(var i = this.validTypes.length - 1; i >= 0; i--){
                var type = this.validTypes[i];
                if(target instanceof type){
                    // if no filter, or filter and result is true
                    if(!this.filter || this.filter(target)){
                        return true;
                    }
                }
            }
            return false;
        },
    };

    root.RL.ValidTargetsFinder = ValidTargetsFinder;

}(this));