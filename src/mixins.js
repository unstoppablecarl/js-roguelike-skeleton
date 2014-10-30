(function(root) {
    'use strict';

    /**
     * Mixins. Collections of properties to be mixed into objects.
     * Functionality is placed in a mixin so that it can be shared by multiple objects without repeating the same code.
     * Modifiactions to mixin functionality will be reflected in all objects using this mixin.
     * If the mixin code was copied and pasted, code changes would need to be made in multiple places.
     * No flexibility is lost as objects with mixins added to them may still override or extend the mixed in functionality.
     * @class Mixins
     * @static
     */
    var Mixins = {
        /**
         * Adds the funcitonality required for a `Renderer` or `RendererLayer` to retrieve `TileDrawData` from an object.
         * @class TileDraw
         * @static
         */
        TileDraw: {
            /**
             * Returns as `tileData`object used by `Renderer` objects to draw tiles.
             * @method getTileDrawData
             * @return {TileDrawData}
             */
            getTileDrawData: function() {
                return {
                    char:               this.char,
                    color:              this.color,
                    bgColor:            this.bgColor,
                    borderColor:        this.borderColor,
                    borderWidth:        this.borderWidth,
                    charStrokeColor:    this.charStrokeColor,
                    charStrokeWidth:    this.charStrokeWidth,
                    font:               this.font,
                    fontSize:           this.fontSize,
                    textAlign:          this.textAlign,
                    textBaseline:       this.textBaseline,
                    offsetX:            this.offsetX,
                    offsetY:            this.offsetY,
                };
            },
        }
    };

    root.RL.Mixins = Mixins;

}(this));
