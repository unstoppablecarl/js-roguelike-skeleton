(function(root) {
    'use strict';

    /**
    * Helper for handling user mouse input.
    * @class Mouse
    * @constructor
    * @param {Function} onClick - A function to handle mouse click events. function(x, y){}
    * @param {Function} onHover - A function to handle mouse hover events. function(x, y){}
    */
    var Mouse = function Mouse(onClick, onHover) {
        this.onClick = onClick;
        this.onHover = onHover;
    };

    Mouse.prototype = {
        constructor: Mouse,

        /**
        * A function to handle tile mouse click events.
        * @method onClick
        * @param {Number} x - Mouse x coord relative to window.
        * @param {Number} y - Mouse y coord relative to window.
        */
        onClick: null,

        /**
        * A function to handle tile mouse hover events
        * @method onHover
        * @param {Number} x - Mouse x coord relative to window.
        * @param {Number} y - Mouse y coord relative to window.
        */
        onHover: null,

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
            if(e.type === 'mousemove' && this.onHover){
                this.onHover(e.clientX, e.clientY);
            }
            else if(e.type === 'mouseenter' && this.onHover){
                this.onHover(e.clientX, e.clientY);
            }
            else if(e.type === 'mouseleave' && this.onHover){
                this.onHover(false);
            }
            else if(e.type === 'click' && this.onClick){
                this.onClick(e.clientX, e.clientY);
            }
        },

        /**
        * Hander for mouse move events
        * @method mouseMove
        * @param {Event} e - mouse event
        */
        mouseMove: function(e) {
            if(this.onHover){
                var coords = this.game.renderer.mouseToTileCoords(e.clientX, e.clientY);
                this.onHover(coords);
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
