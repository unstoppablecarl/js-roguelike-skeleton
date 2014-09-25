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

    var DIRECTIONS = Object.keys(DIRECTIONS_TO_OFFSETS);

    /**
    * Utility functions
    * @class Util
    * @static
    */
    var Util = {


        /**
         * Maps directions to coord offsets
         * ( keys of Util.DIRECTIONS_TO_OFFSETS)
         * @property DIRECTIONS
         * @type Array
         * @static
         * @final
         * @example
         *     `
         *      [
         *          'up',
         *          'up_right',
         *          'right',
         *          'down_right',
         *          'down',
         *          'down_left',
         *          'left',
         *          'up_left',
         *      ]
         *     `
         */
        DIRECTIONS: DIRECTIONS,

        /**
         * Maps direction names to coord offsets.
         * @property DIRECTIONS_TO_OFFSETS
         * @type Object
         * @static
         * @final
         * @example
         *     `{
         *        up:           {x:  0, y: -1},
         *        up_right:     {x:  1, y: -1},
         *        right:        {x:  1, y:  0},
         *        down_right:   {x:  1, y:  1},
         *        down:         {x:  0, y:  1},
         *        down_left:    {x: -1, y:  1},
         *        left:         {x: -1, y:  0},
         *        up_left:      {x: -1, y: -1}
         *     }`
         */
        DIRECTIONS_TO_OFFSETS: DIRECTIONS_TO_OFFSETS,

        /**
        * Merges settings with default values.
        * @method merge
        * @static
        * @param {Object} defaults - Default values to merge with.
        * @param {Object} settings - Settings to merge with default values.
        */
        merge: function(defaults, settings) {
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
        * Gets the adjacent coords of a given x, y, direction.
        * @method getAdjacentTileCoordsFromDirection
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
    };

    root.RL.Util = Util;

}(this));
