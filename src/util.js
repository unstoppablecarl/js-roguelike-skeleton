(function(root) {
    'use strict';

    var DIRECTIONS_TO_OFFSETS = {
        up:           {x:  0, y: -1},
        up_right:     {x:  1, y: -1},
        right:        {x:  1, y:  0},
        down_right:   {x:  1, y:  1},
        down:         {x:  0, y:  1},
        down_left:    {x: -1, y:  1},
        left:         {x: -1, y:  0},
        up_left:      {x: -1, y: -1}
    };

    var DIRECTIONS_4 = [
        'up',
        'down',
        'left',
        'right'
    ];

    var DIRECTIONS_8 = [
        'up',
        'up_right',
        'right',
        'down_right',
        'down',
        'down_left',
        'left',
        'up_left'
    ];

    var DIRECTIONS_TO_OPPOSITES = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left',
        'up_right': 'down_left',
        'down_left': 'up_right',
        'up_left': 'down_right',
        'down_right': 'up_left'
    };

    /**
    * Utility functions.
    * @class Util
    * @static
    */
    var Util = {

        /**
         * List of 4 directions as strings.
         * Used to match property keys of `Util.DIRECTIONS_TO_OFFSETS`.
         * @property DIRECTIONS_4
         * @type {Array}
         * @static
         * @final
         * @example
         *     [
         *         'up',
         *         'right',
         *         'down',
         *         'left',
         *     ]
         */
        DIRECTIONS_4: DIRECTIONS_4,

        /**
         * List of 8 directions as strings.
         * Used to match property keys of `Util.DIRECTIONS_TO_OFFSETS`.
         * @property DIRECTIONS_8
         * @type {Array}
         * @static
         * @final
         * @example
         *     [
         *         'up',
         *         'up_right',
         *         'right',
         *         'down_right',
         *         'down',
         *         'down_left',
         *         'left',
         *         'up_left',
         *     ]
         */
        DIRECTIONS_8: DIRECTIONS_8,

        /**
         * Maps direction names their opposite direction name.
         * @property DIRECTIONS_OPPOSITES
         * @type {Object}
         * @static
         * @final
         * @example
         *     {
         *        up:           {x:  0, y: -1},
         *        up_right:     {x:  1, y: -1},
         *        right:        {x:  1, y:  0},
         *        down_right:   {x:  1, y:  1},
         *        down:         {x:  0, y:  1},
         *        down_left:    {x: -1, y:  1},
         *        left:         {x: -1, y:  0},
         *        up_left:      {x: -1, y: -1}
         *     }
         */
        DIRECTIONS_TO_OFFSETS: DIRECTIONS_TO_OFFSETS,

        /**
         * Maps direction names to coord offsets.
         * @property DIRECTIONS_TO_OFFSETS
         * @type {Object}
         * @static
         * @final
         * @example
         *     {
         *         'up': 'down',
         *         'down': 'up',
         *         'left': 'right',
         *         'right': 'left',
         *         'up_right': 'down_left',
         *         'down_left': 'up_right',
         *         'up_left': 'down_right',
         *         'down_right': 'up_left'
         *     };
         */
        DIRECTIONS_TO_OPPOSITES: DIRECTIONS_TO_OPPOSITES,

        /**
        * Merges settings with default values.
        * @method mergeDefaults
        * @static
        * @param {Object} defaults - Default values to merge with.
        * @param {Object} settings - Settings to merge with default values.
        * @return {Object} A new object with settings replacing defaults.
        */
        mergeDefaults: function(defaults, settings) {
            var out = {};
            for (var key in defaults) {
                if (key in settings) {
                    out[key] = settings[key];
                } else {
                    out[key] = defaults[key];
                }
            }
            return out;
        },

        /**
        * Copy all of the properties in the source objects over to the destination object, and return the destination object.
        * It's in-order, so the last source will override properties of the same name in previous arguments.
        * @method merge
        * @static
        * @param {Object} destination - The object to copy properties to.
        * @param {Object} source* - The object to copy properties from.
        * @return {Object} The `destination` object.
        */
        merge: function(destination){
            var sources = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                for(var key in source){
                    destination[key] = source[key];
                }
            }
            return destination;
        },

        /**
        * Gets the offset coords of a given direction.
        * @method getOffsetCoordsFromDirection
        * @static
        * @param {String} direction - valid directions: [`up`, `down`, `left`, `right`, `up_left`, `up_right`, `down_left`, `down_right`];.
        * @return {Object} `{x: 0, y: 0}`
        */
        getOffsetCoordsFromDirection: function(direction){
            return {
                x: this.DIRECTIONS_TO_OFFSETS[direction].x,
                y: this.DIRECTIONS_TO_OFFSETS[direction].y
            };
        },

        /**
         * Gets the distance in tile moves from point 1 to point 2.
         * @method getTileMoveDistance
         * @param {Number} x1
         * @param {Number} y1
         * @param {Number} x2
         * @param {Number} y2
         * @param {Bool} [diagonalMovement=false]if true, calculate the distance taking into account diagonal movement.
         * @return {Number}
         */
        getTileMoveDistance: function(x1, y1, x2, y2, diagonalMovement){
            if(!diagonalMovement){
                return Math.abs(x2 - x1) + Math.abs(y2 - y1);
            } else {
                return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
            }
        },

        /**
         * Gets the distance from point 1 to point 2.
         * @method getDistance
         * @param {Number} x1
         * @param {Number} y1
         * @param {Number} x2
         * @param {Number} y2
         * @return {Number}
         */
        getDistance: function(x1, y1, x2, y2){
            var dx = x2 - x1;
            var dy = y2 - y1;
            return Math.sqrt(dx*dx + dy*dy);
        },
    };

    root.RL.Util = Util;

}(this));
