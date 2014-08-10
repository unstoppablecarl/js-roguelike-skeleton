(function(root) {
    'use strict';

    /**
    * Represents a Stats in the game map
    * @class Stats
    * @constructor
    * @param {Object} game - Game instance this obj is attached to.
    * @param {String} type - Type of Stats. When created this object is merged with the value of Stats.Types[type].
    * @param {Number} x - The map Stats coordinate position of this Stats on the x axis.
    * @param {Number} y - The map Stats coordinate position of this Stats on the y axis.
    */
    var Stats = function Stats(entity, type, x, y) {
        this.game = game;
        this.modifierLists = [];

    };

    Stats.prototype = {
        constructor: Stats,

        /**
        * Game instance this obj is attached to.
        *
        * @property game
        * @type Game
        */
        game: null,

        data: null,

        modifierLists: null,

        addModifierList: function(modifierList){
            var default = {
                id: null,
                stat: null,
                value: null,
                source: null,
            };
        },
        removeModifier: function(){

        },
        reset: function(){

            for(var key in Stats.Types){
                var stat = Stats.Types[key];
                this.data[key] = stat.default;
            }

        }
    };

    /**
    * Describes different types of Statss. Used by the Stats constructor 'type' param.
    *
    *     Stats.Types = {
    *         floor: {
    *            name: 'Floor',
    *            char: '.',
    *            color: '#333',
    *            bgColor: '#111',
    *            passable: true,
    *            blocksLos: false
    *         },
    *         // ...
    *     }
    *
    * @class Stats.Types
    * @statsic
    */
    Stats.Types = {
        hp: {
            name: 'HP',
            modifiable: false,
            default: 1,
        },
        hp_max: {
            name: 'HP Max',
            modifiable: true,
            default: 1
        },

    };

    root.RL.Stats = Stats;

}(this));
