(function(root) {
    'use strict';

    /**
    * Represents an entity in the game. Usually a character or enemy.
    * @class Entity
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {String} type - Type of entity. When created this object is merged with the value of Entity.Types[type].
    */
    var Entity = function Entity(game, type) {
        this.game = game;
        this.type = type;
        var typeData = Entity.Types[type];
        if(!typeData){
            throw new Error('EntityType "' + type + '" not found.');
        }
        for(var key in typeData){
            this[key] = typeData[key];
        }

        if(this.initialize){
            this.initialize();
        }
    };

    Entity.prototype = {
        constructor: Entity,

        /**
        * Game instance this object is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * The type of entity this is.
        * When created this object is merged with the value of Entity.Types[type].
        * @property type
        * @type String
        */
        type: null,

        /**
        * Called when the entity is first created. Intended to be assigned by Entity.Types.
        * @method initialize
        */
        initialize: function(){

        },

        /**
        * Name used when referencing or describing this entity.
        * Used in console messages.
        * @property name
        * @type String
        */
        name: null,

        /**
        * The x map tile coord of this entity.
        * @property x
        * @type Number
        */
        x: null,

        /**
        * The y map tile coord of this entity.
        * @property y
        * @type Number
        */
        y: null,

        /**
        * The character displayed when rendering this entity.
        * @property char
        * @type String
        */
        char: 'x',

        /**
        * The color of the character displayed when rendering this entity. Not rendered if false.
        * @property color
        * @type String|bool
        */
        color: '#fff',

        /**
        * The background color the character displayed when rendering this entity. Not rendered if false.
        * @property bgColor
        * @type String|bool
        */
        bgColor: false,

        /**
        * Determines if this entity has been killed and needs to be removed.
        * @property dead
        * @type bool
        */
        dead: false,

        /**
        * Determines if this entity can be pushed by the player.
        * @property pushable
        * @type bool
        */
        pushable: false,

        /**
        * Called after a player action has been resolved. Resolves this entities turn.
        * @method update
        */
        update: function() {

        },

        /**
        * Checks if this entity can move to the specified map tile
        * @method canMoveTo
        * @param {Number} x - The tile map x coord to check if this entity can move to.
        * @param {Number} y - The tile map y coord to check if this entity can move to.
        * @return {Bool}
        */
        canMoveTo: function(x, y){
            var entity = this.game.entityManager.get(x, y);
            if(entity){
                return false;
            }
            return this.game.map.canMoveThroughTile(x, y);
        },

        /**
        * Changes the position of this entity on the map.
        * @method moveTo
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        moveTo: function(x, y) {
            this.game.entityManager.move(x, y, this);
        },

        /**
        * Handles the behavior of a player or other entity attempting to move into the tile coord this entity is currently occupying.
        * @method bump
        * @param {Entity} entity - The player or entity attemplting to move into this entity's tile.
        */
        bump: function(entity){
            // if this entity can be pushed and the pushing entity is the player
            if(this.pushable && entity === this.game.player){
                var pusherX = entity.x,
                    pusherY = entity.y,
                    directionX = this.x - pusherX,
                    directionY = this.y - pusherY,
                    targetX = this.x + directionX,
                    targetY = this.y + directionY;

                var targetPushEnt = this.game.entityManager.get(targetX, targetY);
                if(!targetPushEnt){
                    var targetPushTile = this.game.map.get(targetX, targetY);
                    if(targetPushTile.passable){
                        var prevX = this.x,
                            prevY = this.y;
                        // push target entity into tile
                        this.moveTo(targetX, targetY);
                        // move player into previously occupied tile
                        entity.moveTo(prevX, prevY);
                    }
                }
            }
        }
    };

    /**
    * Describes different types of entities. Used by the Entity constructor 'type' param.
    *
    *     Entity.Types = {
    *         zombie: {
    *            name: 'Zombie',
    *            char: 'z',
    *            color: 'red',
    *            bgColor: '#222',
    *            pushable: false
    *         },
    *         // ...
    *     }
    *
    * @class Entity.Types
    * @static
    */
    Entity.Types = {
        zombie: {
            name: 'Zombie',
            char: 'z',
            color: 'red',
            bgColor: false,
            pushable: false,
        },
        statue: {
            name: 'Statue',
            char: 's',
            color: '#808080',
            bgColor: '#222',
            pushable: true
        }
    };

    root.RL.Entity = Entity;

}(this));
