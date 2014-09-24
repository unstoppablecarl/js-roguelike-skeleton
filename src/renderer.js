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
            this.offsetY = Math.floor(this.width * 0.5);

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
        * Draws map and entity tiles. All parameters will fall back to this.game.<param> if not provided.
        * @method draw
        * @param {Map} [map] - Map object to draw.
        * @param {EntityManager} [entityManager] - EntityManager object to draw entities from.
        * @param {Player} [player] - Player object to draw.
        * @param {Fov} [fov] - Fov object to check visibility of tiles.
        * @param {Lighting} [lighting] - Lighting object to shade map tiles with.
        */
        draw: function(map, entityManager, player, fov, lighting){
            if(this.game){
                map = map || this.game.map;
                entityManager = entityManager || this.game.entityManager;
                player = player || this.game.player;
                fov = fov || player.fov;
                lighting = lighting || this.game.lighting;
            }
            var ctx = this.bufferCtx;
            this.drawMap(ctx, map, fov, lighting);
            if(entityManager || player){
                this.drawEntities(ctx, entityManager, player, fov);
            }
            // draw from buffer canvas to canvas in DOM only once all buffer draws are complete
            this.ctx.drawImage(this.buffer, 0, 0, this.canvas.width, this.canvas.height);
        },

        /**
        * Draws map tiles
        * @method drawMap
        * @param {CanvasRenderingContext2D} ctx - Canvas context to draw to
        * @param {Map} map - Map object to draw.
        * @param {Fov} [fov] - Fov object to check visibility of tiles.
        * @param {Lighting} [lighting] - Lighting object to shade map tiles with.
        */
        drawMap: function(ctx, map, fov, lighting){
            // fill the bg
            ctx.fillStyle = this.bgColor;
            ctx.fillRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            // count down for performance
            for (var x = this.width - 1; x >= 0; x--) {
                for (var y = this.height - 1; y >= 0; y--) {

                    // get the actual map tile coord from view coord using offset
                    var tileX = x + this.originX,
                        tileY = y + this.originY,
                        visible = true,
                        mapTile = map.get(tileX, tileY);

                    if(!mapTile){
                        continue;
                    }

                    // if fov is provided check for visibility
                    if(fov && !fov.get(tileX, tileY)){
                        visible = false;
                    }

                    var explored = mapTile.explored;

                    // if maptile has not been explored and is not visible draw nothing
                    if(!explored && !visible){
                        continue;
                    }

                    var tileData = {
                        char: mapTile.char,
                        color: mapTile.color,
                        bgColor: mapTile.bgColor,
                    };

                    if(lighting){
                        lighting.shadeTile(tileX, tileY, tileData);
                    }

                    // change the bg color of the hovered tile
                    if(tileX === this.hoveredTileX && tileY === this.hoveredTileY){
                        tileData.bgColor = this.hoverColor;
                    }

                    if(!visible){
                        ctx.globalAlpha = this.nonVisibleTileAlpha;
                    }
                    this.drawTile(tileX, tileY, tileData, ctx);
                    ctx.globalAlpha = 1;
                }
            }
        },

        /**
        * Draws entity tiles
        * @method drawEntities
        * @param {CanvasRenderingContext2D} ctx - Canvas context to draw to.
        * @param {EntityManager} entityManager - EntityManager object to draw entities from.
        * @param {Player} [player] - Player object to draw.
        * @param {FOV} [fov] - Fov object to check visibility of tiles.
        */
        drawEntities: function(ctx, entityManager, player, fov){

            var playerX,
                playerY;

            if(player){
                playerX = player.x;
                playerY = player.y;
            }

            // count down for performance
            for (var x = this.width - 1; x >= 0; x--) {
                for (var y = this.height - 1; y >= 0; y--) {

                    // get the actual map tile coord from view coord using offset
                    var tileX = x + this.originX,
                        tileY = y + this.originY,
                        entity = false;

                    // if fov is provided check for visibility
                    if(fov && !fov.get(tileX, tileY)){
                        continue;
                    }

                    // check if the entity is the player
                    if (player && tileX === playerX && tileY === playerY) {
                            entity = player;
                    } else {
                        entity = entityManager.get(tileX, tileY);
                    }

                    if(!entity){
                        continue;
                    }

                    var tileData = {
                        char: entity.char,
                        color: entity.color,
                        bgColor: entity.bgColor,
                    };
                    this.drawTile(tileX, tileY, tileData, ctx);
                }
            }
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
