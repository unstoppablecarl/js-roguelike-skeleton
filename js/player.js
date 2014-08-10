(function(root) {
    'use strict';

    /**
    * Represents the player.
    * @class Player
    * @constructor
    * @param {Game} game - game instance this obj is attached to
    */
    var Player = function Player(game) {
        this.game = game;
    };

    Player.prototype = {
        constructor: Player,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Name used when referencing describing this player.
        * Used in console messages.
        * @property name
        * @type String
        */
        name: 'Player',

        /**
        * The map tile coordinate position of the player on the x axis.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The map tile coordinate position of the player on the y axis.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this player.
        * @property char
        * @type String
        */
        char: '@',

        /**
        * The color of the character displayed when rendering this player.
        * @property color
        * @type String|bool
        */
        color: '#fff',

        /**
        * The background color the character displayed when rendering this player.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        /**
        * Called when user key is pressed with action of key pressed as an arg.
        * @method update
        * @param {String} action - action bound to key pressed by user
        */
        update: function(action) {
            if (!action) {
                return;
            }

            var moveX = 0,
                moveY = 0;

            if (action === 'up') {
                moveY = -1;
            } else if (action === 'down') {
                moveY = 1;
            } else if (action === 'left') {
                moveX = -1;
            } else if (action === 'right') {
                moveX = 1;
            }

            if (moveX !== 0 || moveY !== 0) {
                this.move(moveX, moveY);
            }

            if(action === 'wait'){
                this.wait();
            }

        },

        move: function(x, y){
            var targetX = this.x + x,
                targetY = this.y + y,
                // targeted tile (attempting to move into)
                targetTile = this.game.map.get(targetX, targetY),
                // entity occupying target tile (if any)
                targetTileEnt = this.game.entityManager.get(targetX, targetY);

            // if there is an entity in the target tile
            if (targetTileEnt) {
                this.game.console.log('Excuses me <strong>Mr.' + targetTileEnt.name + '</strong>, you appear to be in the way.');
                targetTileEnt.bump(this);
            }
            // if passable move player to target tile
            else if (targetTile.passable) {
                this.moveTo(targetX, targetY);
            }
            else {
                targetTile.bump(this);
            }
        },

        wait: function(){

        },

        /**
        * Changes the position of this entity on the map.
        * @method moveTo
        */
        moveTo: function(x, y){
            this.game.entityManager.move(x, y, this);
        }
    };

    root.RL.Player = Player;

}(this));
