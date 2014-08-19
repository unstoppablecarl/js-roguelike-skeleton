(function(root) {
    'use strict';

    /**
    * Represents the game.
    * @class Game
    * @constructor
    */
    var Game = function Game() {

        // un-populated instance of Array2d
        this.map = new RL.Map();
        this.entityManager = new RL.EntityManager(this);
        this.renderer = new RL.Renderer(this);
        this.console = new RL.Console(this);
        this.fov = new RL.Fov(this);
        this.lighting = new RL.LightingROT(this);

        // player purposefully not added to entity manager (matter of preference)
        this.player = new RL.Player(this);

        // make sure "this" is this instance of Input not document when this.onKeyAction is called
        this.onKeyAction = this.onKeyAction.bind(this);
        this.onTileClick = this.onTileClick.bind(this);
        this.onTileHover = this.onTileHover.bind(this);

        this.input = new RL.Input(this.onKeyAction);
        this.mouse = new RL.Mouse(this, this.onTileClick, this.onTileHover);

    };

    Game.prototype = {
        constructor: Game,

        /**
        * The current map.
        * @property map
        * @type Array2d
        */
        map: null,

        /**
        * The current entityManager.
        * @property entityManager
        * @type EntityManager
        */
        entityManager: null,

        /**
        * The current Fov.
        * @property fov
        * @type Fov
        */
        fov: null,

        /**
        * The current Lighting.
        * @property lighting
        * @type Lighting
        */
        lighting: null,

        /**
        * The current renderer.
        * @property renderer
        * @type Renderer
        */
        renderer: null,

        /**
        * The current console.
        * @property console
        * @type Console
        */
        console: null,

        /**
        * The current player.
        * @property player
        * @type Player
        */
        player: null,

        /**
        * The current input.
        * @property input
        * @type Input
        */
        input: null,

        /**
        * The current mouse.
        * @property mouse
        * @type Mouse
        */
        mouse: null,

        /**
        * Sets the size of the map resizing this.map and this.entityManager.
        * @method setMapSize
        * @param {Number} width - Width in tilse to set map and entityManager to.
        * @param {Number} height - Height in tilse to set map and entityManager to.
        */
        setMapSize: function(width, height){
            this.map.setSize(width, height);
            this.fov.setSize(width, height);
            this.entityManager.setSize(width, height);
            this.lighting.setSize(width, height);
        },

        /**
        * Starts the game.
        * @method start
        */
        start: function() {
            // set player position (player is not added to the enitity manager)
            this.entityManager.move(this.player.x, this.player.y, this.player);
            this.fov.update(this.player.x, this.player.y);
            this.lighting.update();
            this.renderer.setCenter(this.player.x, this.player.y);
            this.renderer.draw();
        },

        /**
        * Handler for user input actions.
        * @method onKeyAction
        * @param {String} action - Action triggered by user input.
        */
        onKeyAction: function(action) {
            this.player.update(action);
            this.entityManager.update();
            this.fov.update(this.player.x, this.player.y);
            this.lighting.update();
            this.renderer.setCenter(this.player.x, this.player.y);
            this.renderer.draw();
        },

        /**
        * Handler for user mouse tile click.
        * @method onTileClick
        * @param {Tile} tile - The tile clicked.
        */
        onTileClick: function(tile){
            var entityTile = this.entityManager.get(tile.x, tile.y);
            console.log('tile', tile);
            if(entityTile){
                this.console.log('Looks like a <strong>' + entityTile.name + '</strong> standing on a <strong>' + tile.name + '</strong> to me.');
            }
            else{
                this.console.log('Looks like a <strong>' + tile.name + '</strong> to me.');
            }
        },

        /**
        * Handler for user mouse tile hover.
        * @method onTileHover
        * @param {Tile} tile - The tile hovered.
        */
        onTileHover: function(tile){
            var prevX = this.renderer.hoveredTileX,
                prevY = this.renderer.hoveredTileY,
                x, y;
            if(tile){
                x = tile.x;
                y = tile.y;
                this.renderer.hoveredTileX = tile.x;
                this.renderer.hoveredTileY = tile.y;
            } else {
                this.renderer.hoveredTileX = null;
                this.renderer.hoveredTileY = null;
            }
            this.renderer.draw();
        }
    };

    root.RL.Game = Game;

}(this));
