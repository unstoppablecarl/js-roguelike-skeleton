(function(root) {
    'use strict';

    /**
    * Container for all game objects.
    * Handles updating the state of game objects each turn.
    * Listens for player input to trigger and resolve new turns.
    * @class Game
    * @constructor
    */
    var Game = function Game() {

        // un-populated instance of Array2d
        this.map = new RL.Map(this);
        this.entityManager = new RL.ObjectManager(this, RL.Entity);
        this.renderer = new RL.Renderer(this);
        this.console = new RL.Console(this);
        this.lighting = new RL.LightingROT(this);

        // player purposefully not added to entity manager (matter of preference)
        this.player = new RL.Player(this);

        // make sure "this" is this instance of Game when this.onKeyAction is called
        this.onKeyAction = this.onKeyAction.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onHover = this.onHover.bind(this);

        this.input = new RL.Input(this.onKeyAction);
        this.mouse = new RL.Mouse(this.onClick, this.onHover);

        var el = this.renderer.canvas;
        this.mouse.startListening(el);
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
        * If true input actions are ignored.
        * @property gameOver
        * @type {Bool}
        */
        gameOver: false,

        /**
         * If true the map will be drawn even if `this.player.update(action)` returns false.
         * `this.queueDraw` is set to false after every update.
         * @property queueDraw
         * @type {Boolean}
         */
        queueDraw: false,

        /**
        * Sets the size of the map resizing this.map and this.entityManager.
        * @method setMapSize
        * @param {Number} width - Width in tilse to set map and entityManager to.
        * @param {Number} height - Height in tilse to set map and entityManager to.
        */
        setMapSize: function(width, height){
            this.map.setSize(width, height);
            this.player.fov.setSize(width, height);
            this.entityManager.setSize(width, height);
            this.lighting.setSize(width, height);
        },

        /**
        * Starts the game.
        * @method start
        */
        start: function() {
            // set player position (player is not added to the enitity manager)
            this.entityManager.add(this.player.x, this.player.y, this.player);
            this.player.updateFov();
            this.lighting.update();
            this.renderer.setCenter(this.player.x, this.player.y);
            this.renderer.draw();
        },

        /**
        * Handles user input actions.
        * @method onKeyAction
        * @param {String} action - Action triggered by user input.
        */
        onKeyAction: function(action) {
            if(!this.gameOver){
                var result = this.player.update(action);
                if(result){

                    this.entityManager.update(this.player);
                    this.player.updateFov();

                    this.lighting.update();
                    this.renderer.setCenter(this.player.x, this.player.y);
                    this.renderer.draw();

                } else if(this.queueDraw){
                    this.renderer.draw();
                }
            }
            this.queueDraw = false;
        },

        /**
        * Handles tile mouse click events.
        * @method onClick
        * @param {Number} x - Mouse x coord relative to window.
        * @param {Number} y - Mouse y coord relative to window.
        */
        onClick: function(x, y){
            var coords = this.renderer.mouseToTileCoords(x, y),
                tile = this.map.get(coords.x, coords.y);
            if(!tile){
                return;
            }
            var entityTile = this.entityManager.get(tile.x, tile.y);
            if(entityTile){
                this.console.log('Looks like a <strong>' + entityTile.name + '</strong> standing on a <strong>' + tile.name + '</strong> to me.');
            }
            else{
                this.console.log('Looks like a <strong>' + tile.name + '</strong> to me.');
            }
        },

        /**
        * Handles tile mouse hover events
        * @method onHover
        * @param {Number} x - Mouse x coord relative to window.
        * @param {Number} y - Mouse y coord relative to window.
        */
        onHover: function(x, y){
            var coords = this.renderer.mouseToTileCoords(x, y),
                tile = this.map.get(coords.x, coords.y);
            if(tile){
                this.renderer.hoveredTileX = tile.x;
                this.renderer.hoveredTileY = tile.y;
            } else {
                this.renderer.hoveredTileX = null;
                this.renderer.hoveredTileY = null;
            }
            this.renderer.draw();
        },

        /**
         * Gets all objects at tile position
         * @method getObjectsAtPostion
         * @param  {Number} x
         * @param  {Number} y
         * @return {Array}
         */
        getObjectsAtPostion: function(x, y){
            var result = [];

            var entity = this.entityManager.get(x, y);
            if(entity){
                result.push(entity);
            }

            // add items or any other objects that can be placed at a tile coord position

            return result;
        },

        /**
        * Checks if an entity can move through a map tile.
        * This does NOT check for entities on the tile blocking movement.
        * This is where code for special cases changing an entity's ability to pass through a tile should be placed.
        * Things like flying, swimming and ghosts moving through walls.
        * @method entityCanMoveThrough
        * @param {Entity} entity - The entity to check.
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        entityCanMoveThrough: function(entity, x, y){
            var tile = this.map.get(x, y);
            // if tile blocks movement
            if(!tile || !tile.passable){
                return false;
            }
            return true;
        },

        /**
        * Checks if an entity can move through and into a map tile and that tile is un-occupied.
        * @method entityCanMoveTo
        * @param {Entity} entity - The entity to check.
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        entityCanMoveTo: function(entity, x, y){
            if(!this.entityCanMoveThrough(entity, x, y)){
                return false;
            }
            // check if occupied by entity
            if(this.entityManager.get(x, y)){
                return false;
            }
            return true;
        },

        /**
        * Changes the position of an entity on the map.
        * Updates entity position in this.entityManager and calls tile.onEntityEnter.
        * `this.entityCanMoveTo()` should always be checked first.
        * @method entityMoveTo
        * @param {Entity} entity - The entity to move.
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        entityMoveTo: function(entity, x, y){
            this.entityManager.move(x, y, entity);
            var tile = this.map.get(x, y);
            if(tile){
                tile.onEntityEnter(entity);
            }
        },

        /**
        * Checks if a map tile can be seen through.
        * This is where code for special cases like smoke, fog, x-ray vision can be implemented by checking the entity param.
        * @method entityCanSeeThrough
        * @param {Number} x - The x map tile coord to check.
        * @param {Number} y - The y map tile coord to check.
        * @return {Bool}
        */
        entityCanSeeThrough: function(entity, x, y){
            var tile = this.map.get(x, y);
            return tile && !tile.blocksLos;
        },

    };

    root.RL.Game = Game;

}(this));
