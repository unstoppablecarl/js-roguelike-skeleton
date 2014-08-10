(function(root) {
    'use strict';

    /**
    * Helper for handling user mouse input.
    * @class Mouse
    * @constructor
    * @param {Game} game - game instance this obj is attached to.
    * @param {Function} onTileClick - A function to handle tile mouse click events. function(tile){}
    * @param {Tile} onTileClick.tile Tile object clicked.
    * @param {Function} onTileHover - A function to handle tile mouse hover events. function(tile){}
    * @param {Tile} onTileHover.tile Tile object hovered.
    */
    var Mouse = function Mouse(game, onTileClick, onTileHover) {
        this.game = game;
        this.onTileClick = onTileClick;
        this.onTileHover = onTileHover;

        var el = this.game.renderer.canvas;

        el.addEventListener('mousemove', this);
        el.addEventListener('mouseenter', this);
        el.addEventListener('mouseleave', this);
        el.addEventListener('click', this);
    };

    Mouse.prototype = {
        constructor: Mouse,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * A function to handle tile mouse click events
        * @method onTileClick
        * @param {Tile} tile - Tile object clicked.
        */
        onTileClick: null,

        /**
        * Current mouse x axis coord relative to upper left corner of mapview element.
        * @property mapViewMouseX
        * @type Number
        */
        mapViewMouseX: null,
        /**
        * Current mouse y axis coord relative to upper left corner of mapview element.
        * @property mapViewMouseY
        * @type Number
        */
        mapViewMouseY: null,

        /**
        * True if mouse is currently over mapview.
        * @property mapViewMouseOver
        * @type Bool
        */
        mapViewMouseOver: false,

        /**
        * Hander for mouse events
        * @method handleEvent
        * @param {Event} e - mouse event
        */
        handleEvent: function(e){
            if(e.type === 'mousemove'){
                this.mouseMove(e);
            }
            else if(e.type === 'mouseenter'){
                this.mouseEnter(e);
            }

            else if(e.type === 'mouseleave'){
                this.mouseLeave(e);
            }
            else if(e.type === 'click'){
                this.mouseClick(e);
            }
        },

        /**
        * Hander for mouse click events
        * @method mouseClick
        * @param {Event} e - mouse event
        */
        mouseClick: function(e){
            var mx = e.clientX,
                my = e.clientY,
                tile = this.game.renderer.mouseToTileCoords(mx, my);
            if(tile){
                this.onTileClick(tile);
            }
        },

        /**
        * Hander for mouse enter events
        * @method mouseEnter
        * @param {Event} e - mouse event
        */
        mouseEnter: function(e) {
            this.mapViewMouseOver = true;
        },

        /**
        * Hander for mouse leave events
        * @method mouseLeave
        * @param {Event} e - mouse event
        */
        mouseLeave: function(e) {
            this.mapViewMouseOver = false;
            this.mapViewMouseX = null;
            this.mapViewMouseY = null;
        },

        /**
        * Hander for mouse move events
        * @method mouseMove
        * @param {Event} e - mouse event
        */
        mouseMove: function(e) {
            var tile = this.game.renderer.mouseToTileCoords(e.clientX, e.clientY);
            this.onTileHover(tile);

        },
    };

    root.RL.Mouse = Mouse;

}(this));
