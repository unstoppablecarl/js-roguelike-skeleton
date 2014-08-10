(function(root) {
    'use strict';

    /**
    * Responsible for rendering the state of the game map.
    * @class Renderer
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {Number} width - Width of the map view in tiles.
    * @param {Number} height - Height of the map view in tiles.
    * @param {String} [canvasClassName='renderer'] - Css class name for the canvas element.
    */
    var Renderer = function Renderer(game, width, height, canvasClassName) {
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
        * Distance in tiles from center to upper left corner of map view on the x axis.
        * @property offsetX
        * @type Number
        */
        offsetX: null,

        /**
        * Distance in tiles from center to upper left corner of map view on the y axis.
        * @property offsetY
        * @type Number
        */
        offsetY: null,

        /**
        * The map coord of the tile drawn in the upper left corner of the map view on the x axis.
        * @property originX
        * @type Number
        */
        originX: null,

        /**
        * The map coord of the tile drawn in the upper left corner of the map view on the y axis.
        * @property originY
        * @type Number
        */
        originY: null,

        /**
        * The map coord of the tile currently being hovered by the mouse on the x axis.
        * @property hoveredTileX
        * @type Number|Null
        */
        hoveredTileX: null,

        /**
        * The map coord of the tile currently being hovered by the mouse on the y axis.
        * @property hoveredTileY
        * @type Number|Null
        */
        hoveredTileY: null,

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

                this.ctx.scale(devicePixelRatio, devicePixelRatio);
                this.bufferCtx.scale(devicePixelRatio, devicePixelRatio);
            }

            this.canvas.width = width;
            this.canvas.height = height;

            this.buffer.width = width;
            this.buffer.height = height;

            this.offsetX = Math.floor(this.width * 0.5);
            this.offsetY = Math.floor(this.width * 0.5);

        },

        /**
        * Converts mouse pixel coords to map tile coords. Mouse pixel coords must be relative to the current window.
        * @method mouseToTileCoords
        * @param {Number} x - Mouse pixel coord on the x axis.
        * @param {Number} y - Mouse pixel coord on the y axis.
        * @returns {Tile|False}
        */
        mouseToTileCoords: function(x, y){
            var pos = this.canvas.getBoundingClientRect(),
                mx = x - pos.left,
                my = y - pos.top,
                tile = this.pixelToTileCoords(mx, my);
            return tile;
        },

        /**
        * Converts map view pixel coords to map tile coords. Map view pixel coords are relative to the top left of the canvas element.
        * @method pixelToTileCoords
        * @param {Number} x - Map view pixel coord on the x axis.
        * @param {Number} y - Map view pixel coord on the y axis.
        * @returns {Tile|False}
        */
        pixelToTileCoords: function(x, y){
            var tileX = Math.floor(x / this.tileSize) + this.originX,
                tileY = Math.floor(y / this.tileSize) + this.originY,
                tile = this.game.map.get(tileX, tileY);

            if(!tile){
                return false;
            }

            return tile;
        },

        /**
        * Draws the current game state to the map view.
        * @method draw
        */
        draw: function() {

            var map = this.game.map,
                player = this.game.player,
                playerX = player.x,
                playerY = player.y;

            // upper left view tile coords
            this.originX = playerX - this.offsetX;
            this.originY = playerY - this.offsetY;

            // fill the bg
            this.bufferCtx.fillStyle = this.bgColor;
            this.bufferCtx.fillRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            for (var x = this.width - 1; x >= 0; x--) {
                for (var y = this.height - 1; y >= 0; y--) {

                    var tileX = x + this.originX,
                        tileY = y + this.originY;

                    var visible = this.game.fov.get(tileX, tileY),
                        mapTile = map.get(tileX, tileY);



                    if(!mapTile){
                        continue;
                    }

                    var explored = mapTile.explored;

                    if(!explored && !visible){
                        continue;
                    }

                    var tileData = {
                        char: null,
                        color: null,
                        bgColor: null,
                    };

                    tileData.char = mapTile.char;
                    tileData.color = mapTile.color;
                    tileData.bgColor = mapTile.bgColor;

                    var entity = false;
                    if (tileX === playerX && tileY === playerY) {
                        entity = player;
                    } else if(visible){
                        var entityTile = this.game.entityManager.get(tileX, tileY);
                        if (entityTile) {
                            entity = entityTile;
                        }
                    }

                    if(entity){
                        if(entity.char){
                            tileData.char = entity.char;
                        }
                        if(entity.color){
                            tileData.color = entity.color;
                        }
                        if(entity.bgColor){
                            tileData.bgColor = entity.bgColor;
                        }
                    }


                    if(visible){
                        this.game.lighting.shadeTile(tileX, tileY, tileData);
                    }

                    if(tileX === this.hoveredTileX && tileY === this.hoveredTileY){
                        tileData.bgColor = this.hoverColor;
                    }

                    if(!visible){
                        this.bufferCtx.globalAlpha = 0.36;
                    }
                    this.drawTile(tileX, tileY, tileData);
                    this.bufferCtx.globalAlpha = 1;

                }
            }

            this.ctx.drawImage(this.buffer, 0, 0, this.canvas.width, this.canvas.height);

        },

        /**
        * Draws a single tile to the map view.
        * @method drawTile
        * @param {Number} x - Map tile coord on the x axis.
        * @param {Number} y - Map tile coord on the y axis.
        * @param {Object} tileData - Object containing tile draw settings.
        * @param {Object} [tileData.char] - The character to draw.
        * @param {Object} [tileData.color] - The color of the character displayed.
        * @param {Object} [tileData.bgColor] - The background color of the tile.
        * @param {CanvasRenderingContext2D} [ctx=this.bufferCtx] - The canvas context to draw to.
        */
        drawTile: function(x, y, tileData, ctx) {
            ctx = ctx || this.bufferCtx;
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

            if(tileData.char && tileData.color){
                ctx.fillStyle = tileData.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = this.tileSize + 'px ' + this.font;
                ctx.fillText(
                    tileData.char,
                    x * (this.tileSize) + (this.tileSize * 0.5),
                    y * (this.tileSize) + (this.tileSize * 0.5)
                );
            }
        }
    };

    root.RL.Renderer = Renderer;

}(this));
