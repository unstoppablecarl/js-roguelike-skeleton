(function(root) {
    'use strict';

    /**
    * Represents lighting in the game map. requires ROT.js
    * Manages position of lights.
    * Calculates illumination of map tiles.
    * @class LightingROT
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {Object} [settings] - LightingROT settings object.
    * @param {Number} [settings.range] - Maximum range for the most powerful light source.
    * @param {Number} [settings.passes] - Number of computation passes (1: no reflectivity used, 2: reflectivity used)
    * @param {Number} [settings.emissionThreshold] - Minimal amount of light at a cell to be re-emited (only for passes>1).
    */
    var LightingROT = function LightingROT(game, settings) {
        settings = settings || {};
        this.game = game;
        this.lightingMap = new RL.Array2d();
        this.lightingMap.set = this.lightingMap.set.bind(this.lightingMap);

        this.checkVisible = this.checkVisible.bind(this);
        this._fov = new ROT.FOV.PreciseShadowcasting(this.checkVisible);

        settings = RL.Util.mergeDefaults({
            range: 5,
            passes: 2,
            emissionThreshold: 100,
        }, settings);

        this.getTileReflectivity = this.getTileReflectivity.bind(this);
        this._lighting = new ROT.Lighting(this.getTileReflectivity, settings);
        this._lighting.setFOV(this._fov);

        // copy instance
        this.ambientLight = this.ambientLight.slice();
    };

    LightingROT.prototype = {
        constructor: LightingROT,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Array2d storing Lighting data.
        * @property lightingMap
        * @type Array2d
        */
        lightingMap: null,

        /**
        * Reflectivity of wall tiles.
        * @property defaultWallReflectivity
        * @type Number
        */
        defaultWallReflectivity: 0.1,

        /**
        * Reflectivity of floor tiles.
        * @property defaultFloorReflectivity
        * @type Number
        */
        defaultFloorReflectivity: 0.1,

        /**
        * Ambient light
        * @property ambientLight
        * @type Array
        */
        ambientLight: [100, 100, 100],

        /**
        * ROT.FOV instance
        * @property _fov
        * @private
        * @type ROT.FOV
        */
        _fov: null,

        /**
        * ROT.Lighting instance
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
            this._lighting.compute(this.lightingMap.set);
        },

        /**
        * Shades tileData using lighting.
        * @method shadeTile
        * @param {Number} x - The x map coordinate to shade.
        * @param {Number} y - The y map coordinate to shade.
        * @param {TileData} tileData - The `TileData` object to shade.
        * @return {TileData}
        */
        shadeTile: function(x, y, tileData){
            var light = this.ambientLight;
            var lighting = this.get(x, y);

            var overlay = function(c1, c2){
                var out = c1.slice();
                for (var i = 0; i < 3; i++) {
                    var a = c1[i],
                        b = c2[i];
                    if(b < 128){
                        out[i] = Math.round(2 * a * b / 255);
                    } else {
                        out[i] = Math.round(255 - 2 * (255 - a) * (255 - b) / 255);
                    }
                }
                return out;
            };

            if(lighting){
                light = ROT.Color.add(this.ambientLight, lighting);
            }

            if(tileData.color){
                var color = ROT.Color.fromString(tileData.color);
                color = overlay(light, color);
                tileData.color = ROT.Color.toRGB(color);
            }

            if(tileData.bgColor){
                var bgColor = ROT.Color.fromString(tileData.bgColor);
                bgColor = overlay(light, bgColor);
                tileData.bgColor = ROT.Color.toRGB(bgColor);
            }
            return tileData;
        },

        /**
        * Retrieves the visibility of the tile at given coords
        * @method get
        * @param {Number} x - The map coordinate position to get Lighting visibility from on the x axis.
        * @param {Number} y - The map coordinate position to get Lighting visibility from on the y axis.
        */
        get: function(x, y){
            return this.lightingMap.get(x, y);
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
        * @method remove
        */
        remove: function(x, y){
            this._lighting.setLight(x, y);
        },

        /**
        * Returns the reflectivity value of a tile
        * @method getTileReflectivity
        */
        getTileReflectivity: function(x, y){
            var tile = this.game.map.get(x, y);

            if(!tile){
                return 0;
            }

            if(tile.lightingReflectivity){
                return tile.lightingReflectivity;
            }

            if(tile.blocksLos){
                return this.defaultWallReflectivity;
            } else {
                return this.defaultFloorReflectivity;
            }
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
            this.lightingMap.setSize(width, height);
        }

    };

    root.RL.LightingROT = LightingROT;

}(this));
