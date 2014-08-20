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
        this.startListening(el);
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
        * The dom element being rendered to and listened to for mouse events.
        * @property _boundElement
        * @protected
        * @type HTMLElement
        */
        _boundElement: null,

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
            if(this.onTileClick){
                var mx = e.clientX,
                    my = e.clientY,
                    coords = this.game.renderer.mouseToTileCoords(mx, my),
                    tile = this.game.map.get(coords.x, coords.y);
                if(tile){
                    this.onTileClick(tile);
                }
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
            this.onTileHover(false);
        },

        /**
        * Hander for mouse move events
        * @method mouseMove
        * @param {Event} e - mouse event
        */
        mouseMove: function(e) {
            if(this.onTileHover){
                var coords = this.game.renderer.mouseToTileCoords(e.clientX, e.clientY);
                this.onTileHover(coords);
            }
        },

        /**
        * Binds event listener for mouse events.
        * @method startListening
        * @param {HTMLElement} element - The dom element being rendered to.
        */
        startListening: function(element){
            if(this._boundElement){
                this.stopListening();
            }

            element.addEventListener('mousemove', this);
            element.addEventListener('mouseenter', this);
            element.addEventListener('mouseleave', this);
            element.addEventListener('click', this);

            this._boundElement = element;
        },

        /**
        * Unbinds event listener for mouse events.
        * @method stopListening
        */
        stopListening: function(){
            if(!this._boundElement){
                return false;
            }
            var el = this._boundElement;
            el.removeEventListener('mousemove', this);
            el.removeEventListener('mouseenter', this);
            el.removeEventListener('mouseleave', this);
            el.removeEventListener('click', this);
        }
    };

    root.RL.Mouse = Mouse;

}(this));
