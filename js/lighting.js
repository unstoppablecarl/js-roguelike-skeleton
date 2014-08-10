(function(root) {
    'use strict';

    /**
    * Represents lighting in the game map. requires ROT.js
    * @class Lighting
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {Object} [settings]- Lighting settings object.
    * @param {Number} [settings.range] - Maximum range for the most powerful light source.
    * @param {Number} [settings.passes] - Number of computation passes (1: no reflectivity used, 2: reflectivity used)
    * @param {Number} [settings.emissionThreshold] - Minimal amount of light at a cell to be re-emited (only for passes>1).
    */
    var Lighting = function Lighting(game, settings) {
        settings = settings || {};
        this.game = game;
        this.LightingMap = new RL.Array2d();
        this.checkVisible = this.checkVisible.bind(this);
        this.getTileReflectivity = this.getTileReflectivity.bind(this);

        this._fov = new ROT.FOV.PreciseShadowcasting(this.checkVisible);

        settings = RL.Util.merge({
            range: 5,
            passes: 2,
            emissionThreshold: 100,
        }, settings);

        this._lighting = new ROT.Lighting(this.getTileReflectivity, settings);
        this._lighting.setFOV(this._fov);

    };

    Lighting.prototype = {
        constructor: Lighting,

        /**
        * Game instance this obj is attached to.
        *
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Array2d storing Lighting data.
        *
        * @property LightingMap
        * @type Array2d
        */
        LightingMap: null,

        /**
        * Reflectivity of visible tiles.
        *
        * @property reflectivity
        * @type Number
        */
        reflectivity: 0.3,

        /**
        * Ambient light
        *
        * @property ambientLight
        * @type Array
        */
        ambientLight: [200, 200, 200],

        /**
        * ROT.FOV instance
        *
        * @property _fov
        * @private
        * @type ROT.FOV
        */
        _fov: null,

        /**
        * ROT.Lighting instance
        *
        * @property _lighting
        * @private
        * @type ROT.Lighting
        */
        _lighting: null,

        /**
        * Calculates the Lighting data relative to given coords;
        * @method update
        */
        update: function(){
            // this.LightingMap.reset();
            var _this = this;
            this._lighting.compute(this.LightingMap.set.bind(this.LightingMap));
        },

        shadeTile: function(x, y, tileData){
            var light = this.ambientLight;
            var lighting = this.get(x, y);

            if(lighting){
                light = ROT.Color.add(this.ambientLight, lighting);
            }

            if(tileData.color){
                var color = ROT.Color.fromString(tileData.color);
                color = ROT.Color.multiply(color, light);
                tileData.color = ROT.Color.toRGB(color);
            }

            if(tileData.bgColor){
                var bgColor = ROT.Color.fromString(tileData.bgColor);
                bgColor = ROT.Color.multiply(bgColor, light);
                tileData.bgColor = ROT.Color.toRGB(bgColor);
            }

        },

        /**
        * Retrieves the visibility of the tile at given coords
        * @method get
        * @param {Number} x - The map coordinate position to get Lighting visibility from on the x axis.
        * @param {Number} y - The map coordinate position to get Lighting visibility from on the y axis.
        */
        get: function(x, y){
            return this.LightingMap.get(x, y);
        },

        /**
        * Set a light position and color
        * @method set
        * @param {Number} x - The map coordinate position to set lightin on the x axis.
        * @param {Number} y - The map coordinate position to set lightin on the y axis.
        * @param {Number} r - Red.
        * @param {Number} g - Green.
        * @param {Number} b - Blue.
        */
        set: function(x, y, r, g, b){
            this._lighting.setLight(x, y, [r, g, b]);
        },

        /**
        * Returns the reflectivity value of a tile
        * @method getTileReflectivity
        */
        getTileReflectivity: function(x, y){
            if(this.checkVisible(x,y)){
                return 0;
            }
            return this.reflectivity;
        },

        /**
        * Checks if a tile blocks line of sight
        * @method checkVisible
        */
        checkVisible: function(x, y){
            var tile = this.game.map.get(x, y);
            return tile && !tile.blocksLos;
        },

        /**
        * Sets the size of the map to mange Lighting within.
        * @method setSize
        * @param {Number} width - Width of current map in tiles.
        * @param {Number} height - Height of current map in tiles.
        */
        setSize: function(width, height){
            this.LightingMap.setSize(width, height);
        }

    };

    root.RL.Lighting = Lighting;

}(this));
