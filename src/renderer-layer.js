(function(root) {
    'use strict';

    /**
    * Represents a map tile layer to be rendered.
    * @class RendererLayer
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {String} type - Type of `RendererLayer`. When created this object is merged with the value of `RendererLayer.Types[type]`.
    */
    var RendererLayer = function RendererLayer(game, type, settings) {
        this.game = game;
        this.type = type;
        var typeData = RendererLayer.Types[type];
        RL.Util.merge(this, typeData);

        for(var key in settings){
            if(this[key] !== void 0){
                this[key] = settings[key];
            }
        }
    };

    RendererLayer.prototype = {
        constructor: RendererLayer,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of `RendererLayer` this is.
        * When created this object is merged with the value of `RendererLayer.Types[type]`. See constructor.
        * @property type
        * @type {String}
        */
        type: null,

        /**
         * If true, `this.getTileData()` will merge the `tileData` it would otherwise return with the `prevTileData` param (if provided).
         * objects are  from this layer should be merged with layers below before drawing.
         * @property mergeWithPrevLayer
         * @type {Boolean}
         */
        mergeWithPrevLayer: false,

        /**
         * If true, when `this.getTileData(x, y)` returns a value that evaluates to false, all tile layers above this one are not drawn by the `Renderer` for this map tile coord.
         * @property cancelTileDrawWhenNotFound
         * @type {Boolean}
         */
        cancelTileDrawWhenNotFound: false,

        /**
         * If true, `tileData` is drawn to the canvas after processing this layer.
         * @property draw
         * @type {Boolean}
         */
        draw: false,

        /**
         * Before draw function. Ignored if `this.draw = false`.
         * @property beforeDraw
         * @type {Function} `function(x, y, tileData, ctx){}`
         */
        beforeDraw: false,

        /**
         * After draw function. Ignored if `this.draw = false`.
         * @property afterDraw
         * @type {Function} `function(x, y, tileData, ctx){}`
         */
        afterDraw: false,

        /**
         * Get layer's `tileData` for a given map tile coord.
         * @method getTileData
         * @param {Number} x - Map tile x coord.
         * @param {Object} y - Map tile y coord.
         * @param {Object} [prevTileData] - `tileData` object for the given map tile coord from previous layer.
         * @return {TileData|Bool} false if nothing to render
         */
        getTileData: function(x, y, prevTileData){
            return false;
        },

        /**
         * Get layer's `TileData` for a given map tile coord.
         * Optionally modifying the `prevTileData` object param if `this.mergeWithPrevLayer = true`.
         * @method getModifiedTileData
         * @param {Number} x - Map tile x coord.
         * @param {Object} y - Map tile y coord.
         * @param {Object} [prevTileData] - `tileData` object for the given map tile coord from previous layer.
         * @return {TileData|Bool} false if nothing to render
         */
        getModifiedTileData: function(x, y, prevTileData){
            var tileData = this.getTileData(x, y, prevTileData);
            if(this.mergeWithPrevLayer && prevTileData){
                return this.mergeTileData(prevTileData, tileData);
            }
            return tileData;
        },

        /**
         * Merges 2 `tileData` objects.
         * Used to Merges layers of the same tile before drawing them.
         * @method mergeTileData
         * @param {TileData} tileData1 - `tileData` to merge to.
         * @param {TileData} tileData2 - `tileData` to merge from, properties with values on tileData2 replace matching properties on tileData1
         * @return {TileData} A new `tileData` object with merged values.
         */
        mergeTileData: function(tileData1, tileData2){
            var result = {},
                key, val;
            for(key in tileData1){
                result[key] = tileData1[key];
            }
            for(key in tileData2){
                val = tileData2[key];
                if(val !== false && val !== void 0){
                    result[key] = val;
                }
            }
            return result;
        },
    };

    /**
    * Describes different types of `RendererLayer`. Used by the `RendererLayer` constructor `type` param.
    *
    *     RendererLayer.Types = {
    *
    *         // ...
    *     }
    *
    * @class RendererLayer.Types
    * @static
    */
    RendererLayer.Types = {
        map: {
            merge: true,
            cancelTileDrawWhenNotFound: true,
            // draw: true,
            getTileData: function(x, y){

                if(!this.game){
                    return false;
                }

                var tile = this.game.map.get(x, y);

                if(!tile || !tile.explored){
                    return false;
                }

                var tileData = tile.getTileDrawData();

                return tileData;
            }
        },

        entity: {
            mergeWithPrevLayer: true,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                var player = this.game.player;
                var entity = false;
                if (
                    player &&
                    x === player.x &&
                    y === player.y
                ) {
                    entity = player;
                } else if(this.game.entityManager){
                    entity = this.game.entityManager.get(x, y);

                }

                if(
                    this.game.player &&
                    this.game.player.fov &&
                    !this.game.player.fov.get(x, y)
                ){
                    return false;
                }

                if(entity){

                    var tileData = entity.getTileDrawData();
                    return tileData;
                }
                return false;
            }
        },
        lighting: {
            // this layer does mutate the prevTileData but not in the same way as merging
            mergeWithPrevLayer: false,
            draw: true,
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                if(this.game.lighting){
                    prevTileData = this.game.lighting.shadeTile(x, y, prevTileData);
                }
                return prevTileData;
            }
        },
        fov: {
            mergeWithPrevLayer: false,
            draw: true,
            beforeDraw: function(x, y, tileData, ctx){
                ctx.globalAlpha = this.game.renderer.nonVisibleTileAlpha;
            },
            afterDraw: function(x, y, tileData, ctx){
                ctx.globalAlpha = 1;
            },
            getTileData: function(x, y, prevTileData){
                if(!this.game){
                    return false;
                }
                if(
                    this.game.player &&
                    this.game.player.fov &&
                    this.game.player.fov.get(x, y)
                ){
                    return false;
                }

                return {
                    bgColor: this.game.renderer.bgColor
                };

            }
        }
    };

    root.RL.RendererLayer = RendererLayer;

}(this));