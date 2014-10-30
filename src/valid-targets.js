(function(root) {
    'use strict';

    /**
     * Manages a list of valid targets and which is currently selected.
     * @class ValidTargets
     * @constructor
     * @param {Game} game - Game instance this obj is attached to.
     * @param {Array} [targets=Array] An Array of valid target objects to select from (intended to be in the format `validTargetsFinder.getValidTargets()` returns).
     * @param {Object} settings
     * @param {Array} [settings.typeSortPriority=this.typeSortPriority] - Array of types in order of their sort priority.
     * @param {Bool} [settings.mapWidth=game.map.width] - Width of `this.map`.
     * @param {Bool} [settings.mapHeight=game.map.height] - Height of `this.map`.
     * @param {Bool} [settings.skipSort=false] - If true initial sort is skipped.
     */
    var ValidTargets = function(game, targets, settings){
        this.game = game;

        settings = settings || {};
        this.typeSortPriority = settings.typeSortPriority || [].concat(this.typeSortPriority);

        var width = settings.mapWidth || this.game.map.width;
        var height = settings.mapWidth || this.game.map.width;

        this.map = new RL.MultiObjectManager(this.game, null, width, height);
        this.setTargets(targets);
        if(!settings.skipSort){
            this.sort();
        }
    };

    ValidTargets.prototype = {
        constructor: ValidTargets,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type {Game}
        */
        game: null,

        /**
         * Array of target objects.
         * @type {Array}
         * @property targets
         * @readOnly
         */
        targets: null,

        /**
         * Map of target positions.
         * @type {MultiObjectManager}
         * @property map
         *
         */
        map: null,

        /**
         * Currently Selected Object.
         * @property current
         * @type {Object}
         * @readOnly
         */
        current: null,

        /**
         * Array of types in order of their sort priority.
         * @type {Array}
         * @property typeSortPriority
         */
        typeSortPriority: [],

        /**
         * Sets the targets, replacing currently set ones.
         * @method setTargets
         * @param {Array} targets
         */
        setTargets: function(targets){
            targets = targets || [];
            this.targets = targets;
            this.map.reset();
            for(var i = targets.length - 1; i >= 0; i--){
                var target = targets[i];
                this.map.add(target.x, target.y, target);
            }
        },

        /**
         * Sets the currently selected target object.
         * @method setCurrent
         * @param {Object} target
         * @return {Bool} If target was found in `this.targets`. (only set if found).
         */
        setCurrent: function(target){
            var index = this.targets.indexOf(target);
            if(index !== -1){
                this.current = target;
                return true;
            }
            return false;
        },

        /**
         * Gets the currently selected target object.
         * @method getCurrent
         * @param {Bool} [autoset=true] - If no target is set to current autoset the first.
         * @return {Object}
         */
        getCurrent: function(autoset){
            autoset =  autoset !== void 0 ? autoset : true;
            if(autoset && !this.current && this.targets.length){
                this.sort();
                this.setCurrent(this.targets[0]);
            }

            return this.current;
        },

        /**
         * Sets the object after the currently selected object to be the selected object.
         * @method next
         * @return {Object} The new currently selected object.
         */
        next: function(){
            if(!this.current){
                return this.getCurrent();
            }

            var index = this.targets.indexOf(this.current);
            if(index === this.targets.length - 1){
                index = 0;
            } else {
                index++;
            }
            this.setCurrent(this.targets[index]);
            return this.current;
        },

        /**
         * Sets the object before the currently selected object to be the selected object.
         * @method prev
         * @return {Object} The new currently selected object.
         */
        prev: function(){
            if(!this.current){
                return this.getCurrent();
            }

            var index = this.targets.indexOf(this.current);
            if(index === 0){
                index = this.targets.length - 1;
            } else {
                index--;
            }
            this.setCurrent(this.targets[index]);

            return this.current;
        },

        /**
         * Gets the sort priority of an object based on its type using 'this.typeSortPriority'.
         * @method getTypeSortPriority
         * @param {Object} obj
         * @return {Number}
         */
        getTypeSortPriority: function(obj){
            for(var i = this.typeSortPriority.length - 1; i >= 0; i--){
                var type = this.typeSortPriority[i];
                if(obj instanceof type){
                    return i;
                }
            }
        },
        /**
         * Sorts `this.targets` by `this.typeSortPriority` then by range.
         * @method sort
         * @return {Number}
         */
        sort: function(){
            var _this = this;
            this.targets.sort(function(a, b){

                var aTypeSortPriority = _this.getTypeSortPriority(a.value);
                var bTypeSortPriority = _this.getTypeSortPriority(b.value);

                if(aTypeSortPriority === bTypeSortPriority){
                    return a.range - b.range;
                }
                if(aTypeSortPriority > bTypeSortPriority){
                    return 1;
                }
                if(aTypeSortPriority < bTypeSortPriority){
                    return -1;
                }
            });
        },

        /**
         * Finds a target object by its value.
         * @method getTargetByValue
         * @param {Object} value
         * @return {Object}
         */
        getTargetByValue: function(value){
            for(var i = this.targets.length - 1; i >= 0; i--){
                var target = this.targets[i];
                if(target.value === value){
                    return target;
                }
            }
        }
    };

    root.RL.ValidTargets = ValidTargets;

}(this));