(function(root) {
    'use strict';

    /**
    * Renders the current game state using html5 canvas.
    * @class Renderer
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {Number} width - Width of the map view in tiles.
    * @param {Number} height - Height of the map view in tiles.
    * @param {String} [canvasClassName='renderer'] - Css class name for the canvas element.
    */
    var Renderer = function Renderer(game, width, height, canvasClassName) {
        this.layers = [];
        this.game = game;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = canvasClassName || 'renderer';
        this.buffer = this.canvas.cloneNode();
        this.bufferCtx = this.buffer.getContext('2d');
        this.resize(width, height);

    };

    Renderer.prototype = {
        constructor: Renderer,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
         * Tile data layers to draw
         * @type {Array}
         */
        layers: null,

        /**
        * Canvas element this renderer draws to.
        * @property canvas
        * @type HTMLCanvasElement
        */
        canvas: null,

        /**
        * Drawing context of this.canvas
        * @property ctx
        * @type CanvasRenderingContext2D
        */
        ctx: null,

        /**
        * Canvas element this renderer draws to as a buffer for this.canvas.
        * @property buffer
        * @type HTMLCanvasElement
        */
        buffer: null,

        /**
        * Drawing context of this.buffer
        * @property bufferCtx
        * @type CanvasRenderingContext2D
        */
        bufferCtx: null,

        /**
        * Background color of map view.
        * @property bgColor
        * @type String
        */
        bgColor: '#000',

        /**
        * Color overlayed when mouse is over a tile.
        * @property hoverColor
        * @type String
        */
        hoverColor: 'rgba(0,0,200, 0.5)',

        /**
        * Alpha value applied to non-visible tiles
        * @property nonVisibleTileAlpha
        * @type Number
        */
        nonVisibleTileAlpha: 0.36,

        /**
        * Size of each tile is drawn.
        * @property tileSize
        * @type Number
        */
        tileSize: 16,

        /**
        * Font used to render tile characters.
        * @property font
        * @type String
        */
        font: 'monospace',// "DejaVuSansMono",

        /**
        * Device pixel ratio for high dpi screens.
        * @property devicePixelRatio
        * @type Number
        */
        devicePixelRatio: 1,

        /**
        * Map view width in tiles.
        * @property width
        * @type Number
        */
        width: 20,

        /**
        * Map view height in tiles.
        * @property height
        * @type Number
        */
        height: 20,

        /**
        * The x distance in tiles from center to upper left corner of map view.
        * @property offsetX
        * @type Number
        */
        offsetX: null,

        /**
        * The y distance in tiles from center to upper left corner of map view.
        * @property offsetY
        * @type Number
        */
        offsetY: null,

        /**
        * The map tile x coord of the tile drawn in the upper left corner of the map view.
        * @property originX
        * @type Number
        */
        originX: null,

        /**
        * The map tile y coord of the tile drawn in the upper left corner of the map view.
        * @property originY
        * @type Number
        */
        originY: null,

        /**
        * The map tile x coord of the tile currently being hovered by the mouse.
        * @property hoveredTileX
        * @type Number|Null
        */
        hoveredTileX: null,

        /**
        * The map tile y coord of the tile currently being hovered by the mouse.
        * @property hoveredTileY
        * @type Number|Null
        */
        hoveredTileY: null,

        /**
         * Placeholder to add extra draw functionality.
         * Same params as this.draw
         * function(ctx, map, entityManager, player, fov, lighting)
         * @param drawExtra
         * @type {Function}
         */
        drawExtra: false,

        /**
        * Resizes canvas elements to match the tileSize and map view with/height. Also adjusts behavior to accomodate high pixel density screens.
        * @method resize
        */
        resize: function(width, height){
            if(width !== void 0){
                this.width = width;
            }
            if(height !== void 0){
                this.height = height;
            }

            width = this.width * this.tileSize;
            height = this.height * this.tileSize;

            var devicePixelRatio = window.devicePixelRatio || 1;

            if(devicePixelRatio !== 1){

                this.canvas.style.width = width + 'px';
                this.canvas.style.height = height + 'px';

                this.buffer.style.width = width + 'px';
                this.buffer.style.height = height + 'px';

                width = Math.round(width * devicePixelRatio);
                height = Math.round(height * devicePixelRatio);
            }

            this.devicePixelRatio = devicePixelRatio;
            this.canvas.width = width;
            this.canvas.height = height;

            this.buffer.width = width;
            this.buffer.height = height;
            this.bufferCtx.scale(devicePixelRatio, devicePixelRatio);
            this.offsetX = Math.floor(this.width * 0.5);
            this.offsetY = Math.floor(this.height * 0.5);

        },

        /**
        * Draws map and entity tiles. All parameters will fall back to this.game.<param> if not provided.
        * @method draw
        */
        draw: function(){
            this.fillBg();
            for (var x = this.width - 1; x >= 0; x--) {
                for (var y = this.height - 1; y >= 0; y--) {
                    // get the actual map tile coord from view coord using offset
                    var tileX = x + this.originX,
                        tileY = y + this.originY;
                    this.drawTile(tileX, tileY);
                }
            }

            this.drawBufferToCanvas();
        },

        drawTile: function(x, y, layers){
            layers = layers || this.layers;
            var tileData = {};
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];

                tileData = layer.getModifiedTileData(x, y, tileData);

                if(layer.cancelTileDrawWhenNotFound && !tileData){
                    return false;
                }

                if(tileData && layer.draw){
                    if(layer.beforeDraw){
                        layer.beforeDraw(x, y, tileData, this.bufferCtx);
                    }
                    this.drawTileToCanvas(x, y, tileData, this.bufferCtx);
                    if(layer.afterDraw){
                        layer.afterDraw(x, y, tileData, this.bufferCtx);
                    }
                }
            }
        },

        /**
        * Draws a single tile to the map view.
        * @method drawTileToCanvas
        * @param {Number} x - Map tile coord on the x axis.
        * @param {Number} y - Map tile coord on the y axis.
        * @param {Object} tileData - Object containing tile draw settings.
        * @param {Object} [tileData.char] - The character to draw.
        * @param {Object} [tileData.color] - The color of the character displayed.
        * @param {Object} [tileData.bgColor] - The background color of the tile.
        * @param {Object} [tileData.borderColor] - The border color of the tile.
        * @param {Object} [tileData.borderWidth=1] - The border width of the tile.
        * @param {CanvasRenderingContext2D} [ctx=this.bufferCtx] - The canvas context to draw to.
        */
        drawTileToCanvas: function(x, y, tileData, ctx) {
            ctx = ctx || this.bufferCtx;

            var originalX = x,
                originalY = y;

            x -= this.originX;
            y -= this.originY;

            if(tileData.bgColor){
                ctx.fillStyle = tileData.bgColor;
                ctx.fillRect(
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }

            if(tileData.before !== void 0){
                this.drawTileToCanvas(originalX, originalY, tileData.before, ctx);
            }

            if(tileData.char && tileData.color){

                if(tileData.mask){
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                    ctx.clip();
                    ctx.closePath();
                }

                var fontSize = tileData.fontSize || this.tileSize;
                var textX = x * (this.tileSize) + (this.tileSize * 0.5) + (tileData.offsetX || 0);
                var textY = y * (this.tileSize) + (this.tileSize * 0.5) + (tileData.offsetY || 0);

                ctx.fillStyle = tileData.color;
                ctx.textAlign = tileData.textAlign || 'center';
                ctx.textBaseline = tileData.textBaseline || 'middle';

                ctx.font = fontSize + 'px ' + (tileData.font || this.font);
                if(tileData.charStrokeColor){
                    ctx.strokeStyle = tileData.charStrokeColor;
                    ctx.lineWidth = tileData.charStrokeWidth || 1;
                    ctx.strokeText(
                        tileData.char,
                        textX,
                        textY
                    );
                    ctx.strokeText(
                        tileData.char,
                        textX,
                        textY+1
                    );
                }

                ctx.fillText(
                    tileData.char,
                    textX,
                    textY
                );

                if(tileData.mask){
                    ctx.restore();
                }

            }

            if(tileData.after !== void 0){
                this.drawTileToCanvas(originalX, originalY, tileData.after, ctx);
            }

            if(tileData.borderColor){
                var borderWidth = tileData.borderWidth || 1;
                var borderOffset = Math.floor(borderWidth * 0.5);
                var borderRectSize = this.tileSize - borderWidth;
                if(borderWidth % 2 !== 0){
                    borderOffset += 0.5;
                }
                ctx.lineWidth = borderWidth;
                ctx.strokeStyle = tileData.borderColor;

                var bx = x * this.tileSize + borderOffset;
                var by = y * this.tileSize + borderOffset;
                ctx.strokeRect(bx, by, borderRectSize, borderRectSize);
            }
        },

        /**
        * Converts mouse pixel coords to map tile coords. Mouse pixel coords must be relative to the current window.
        * @method mouseToTileCoords
        * @param {Number} x - Mouse pixel x coord.
        * @param {Number} y - Mouse pixel y coord.
        * @return {Object|False} {x: 0, y: 0}
        */
        mouseToTileCoords: function(x, y){
            var pos = this.canvas.getBoundingClientRect(),
                mx = x - pos.left,
                my = y - pos.top;
            return this.pixelToTileCoords(mx, my);
        },

        /**
        * Converts map view pixel coords to map tile coords. Map view pixel coords are relative to the top left of the canvas element.
        * @method pixelToTileCoords
        * @param {Number} x - Map view pixel x coord.
        * @param {Number} y - Map view pixel y coord.
        * @return {Object|False}  {x: 0, y: 0}
        */
        pixelToTileCoords: function(x, y){
            return {
                x: Math.floor(x / this.tileSize) + this.originX,
                y: Math.floor(y / this.tileSize) + this.originY
            };
        },

        /**
        * Sets the center map tile of the view.
        * @method setCenter
        * @param {Number} centerX - Center map tile x coord.
        * @param {Number} centerY - Center map tile y coord.
        */
        setCenter: function(centerX, centerY){
            // origin = map tile coords of the tile in the upper left of view
            this.originX = centerX - this.offsetX;
            this.originY = centerY - this.offsetY;
        },

        /**
         * Fills the canvas with a given color.
         * @method fillBg
         * @param {String} [color=this.bgColor]
         * @param {CanvasRenderingContext2D} [ctx=this.bufferCtx]
         */
        fillBg: function(color, ctx){
            ctx = ctx || this.bufferCtx;
            ctx.fillStyle = color || this.bgColor;
            ctx.fillRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        },

        /**
         * Copies pixel data from the buffer canvas to the game canvas.
         * @method drawBufferToCanvas
         */
        drawBufferToCanvas: function(){
            // draw from buffer canvas to canvas in DOM only once all buffer draws are complete
            this.ctx.drawImage(this.buffer, 0, 0, this.canvas.width, this.canvas.height);
        },
    };

    root.RL.Renderer = Renderer;

    /*
        The following describes an object litteral used by Renderer for the benefit of api doc generation.
     */

    /**
     * An object litteral containing data used by 'Renderer' to draw a map tile.
     * Only one `TileDrawData` object is used per tile when rendering.
     * The final `TileDrawData` object used to draw may have been created by merging multiple `TileDrawData` objects from multiple sources.
     * @class TileDrawData
     * @static
     */

    /**
     * The character to be drawn.
     * @property char
     * @type {String|false}
     */

    /**
     * Character color.
     * @property color
     * @type {css color|false}
     */

    /**
     * Background color.
     * @property bgColor
     * @type {css color|false}
     */

    /**
     * Border color.
     * If false no border will be drawn.
     * @property borderColor
     * @type {css color|false}
     */

    /**
     * Border width.
     * If `this.borderColor` is set `this.borderWidth` will default to 1 if not set.
     * @property borderWidth
     * @type {Number|false}
     */

    /**
     * Character stroke color.
     * @property charStrokeColor
     * @type {css color|false}
     */

    /**
     * Character stroke color.
     * @property charStrokeColor
     * @type {css color|false}
     */

    /**
     * Character stroke width.
     * If `this.charStrokeColor` is set `this.charStrokeWidth` will default to 1 if not set.
     * @property charStrokeWidth
     * @type {Number|false}
     */

    /**
     * Font to be used when drawing character.
     * If not set `Renderer.font` is used.
     * @property font
     * @type {String|false}
     */

    /**
     * Font size to be used when drawing character.
     * If not set `Renderer.fontSize` is used.
     * @property fontSize
     * @type {Number|false}
     */

    /**
     * Text alignment of character. Valid values: 'left', 'right', 'center', 'start', 'end'.
     * @property textAlign
     * @type {String|false}
     */

    /**
     * Text baseling of character. Valid values: 'alphabetic', 'top', 'hanging', 'middle', 'ideographic', 'bottom'.
     * @property textBaseline
     * @type {String|false}
     */

    /**
     * Pixel offset of character.
     * @property offsetX
     * @type {Number|false}
     */

    /**
     * Pixel offset of character.
     * @property offsetY
     * @type {Number|false}
     */

}(this));
