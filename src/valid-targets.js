(function(root) {
    'use strict';

    /**
     * Manages a list of valid targets and which is currently selected.
     * @class ValidTargets
     * @constructor
     * @param {Array} [targets=Array]
     */
    var ValidTargets = function(targets){
        this.targets = targets || [];
    };

    ValidTargets.prototype = {
        constructor: ValidTargets,

        /**
         * Array of target objects.
         * @type {Array}
         */
        targets: null,

        /**
         * Currently Selected Object.
         * @type {Object}
         * @readOnly
         */
        current: null,

        /**
         * Sets the currently selected target.
         * @method setCurrent
         * @param {Object} target
         */
        setCurrent: function(target){
            var index = this.targets.indexOf(target);

            if(index !== -1){
                if(this.current){
                    this.current.selected = false;
                }
                target.selected = true;
                this.current = target;
            }
        },

        /**
         * Gets the currently selected target.
         * @method getCurrent
         * @return {Object}
         */
        getCurrent: function(){
            if(!this.current && this.targets.length){
                this.setCurrent(this.targets[0]);
            }

            return this.current;
        },

        /**
         * Sets the object after the currently selected object to be the selected object.
         * @method next
         * @return {Object}
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
         * @return {Object}
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
        }
    };

    root.RL.ValidTargets = ValidTargets;

}(this));