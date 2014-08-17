(function(root) {
    'use strict';

    /**
    * Utility functions
    * @class Util
    * @constructor
    * @static
    */
    var Util = {
        /**
        * Merges settings with default values.
        * @method merge
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
        }
    };

    root.RL.Util = Util;

}(this));
