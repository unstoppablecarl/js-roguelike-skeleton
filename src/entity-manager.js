(function(root) {
    'use strict';

    /**
    * Manages the current state of all entities.
    * @class EntityManager
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {Number} width - Width of current map in tiles.
    * @param {Number} height - Height of current map in tiles.
    */
    var EntityManager = function EntityManager(game, width, height) {
        this.game = game;
        this.entities = [];
        this.entityMap = new RL.Array2d(width, height);
    };

    EntityManager.prototype = {
        constructor: EntityManager,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Array containing all entities.
        * @property entities
        * @type Array
        */
        entities: null,

        /**
        * Array2d containing all entities by their current map tile coord
        * @property entityMap
        * @type Array2d
        */
        entityMap: null,

        /**
        * Retrieves an entity by map tile coords.
        * @method get
        * @param {Number} x - The map tile coordinate position of the entity on the x axis.
        * @param {Number} y - The map tile coordinate position of the entity on the y axis.
        * @return Entity|false
        */
        get: function(x, y) {
            return this.entityMap.get(x, y);
        },

        /**
        * Adds an entity to the manager.
        * @method add
        * @param {Number} x - The map tile coordinate position of the entity on the x axis.
        * @param {Number} y - The map tile coordinate position of the entity on the y axis.
        * @param {Entity} ent - The entity to be added.
        */
        add: function(x, y, ent) {
            ent.game = this.game;
            ent.x = x;
            ent.y = y;
            this.entities.push(ent);
            this.entityMap.set(x, y, ent);
        },

        /**
        * Removes an entity to the manager.
        * @method remove
        * @param {Entity} ent - The entity to be removed.
        */
        remove: function(ent) {
            this.entityMap.remove(ent.x, ent.y);
            var index = this.entities.indexOf(ent);
            this.entities.splice(index, 1);
        },

        /**
        * Changes the position of an entity already added to this entityManager.
        * @method move
        * @param {Number} x - The new map tile coordinate position of the entity on the x axis.
        * @param {Number} y - The new map tile coordinate position of the entity on the y axis.
        * @param {Entity} ent - The entity to be removed.
        */
        move: function(x, y, ent) {
            this.entityMap.remove(ent.x, ent.y);
            ent.x = x;
            ent.y = y;
            this.entityMap.set(x, y, ent);
        },

        /**
        * Calls the entity.update() method on all entities. Removes dead entities. Typically called after a player has resolved their actions.
        * @method update
        */
        update: function() {
            // count down for performance and so we can remove things as we go
            for (var i = this.entities.length - 1; i >= 0; i--) {
                var ent = this.entities[i];
                if (ent.dead) {
                    this.remove(ent);
                    continue;
                }
                ent.update();
            }
        },

        /**
        * Resets this entityManager.
        * @method reset
        */
        reset: function() {
            this.entities = [];
            this.entityMap.reset();
        },

        /**
        * Sets the size of the map to manage entities within.
        * @method setSize
        * @param {Number} width - Width of current map in tiles.
        * @param {Number} height - Height of current map in tiles.
        */
        setSize: function(width, height){
            this.entityMap.setSize(width, height);
        },

        /**
        * Loads Entity data from an array of strings.
        * @method loadEntitiesFromArrayString
        * @param {Array} mapData - The array of strings to load.
        * @param {Object} charToType - An object mapping string characters to Entity types (see Entity.Types[type]). Characters in mapData not in charToType are ignored.
        * @param {Bool} [replaceCurrentEntities=false] - If true current entities at positons of entities being added will be removed. Otherwise new entities at occupied positions will be skipped.
        * @example

            // 'P' will be ignored and a floor tile will be placed at that position
            var mapData = [
                '####',
                '#..#',
                '#.Z#',
                '####',
            ],
            charToType = {
                'Z': 'zombie'
            };

            entityManager.loadTilesFromArrayString(mapData, charToType);
        *
        */
        loadEntitiesFromArrayString: function(mapData, charToType, replaceCurrentEntities){
            var _this = this,
                width = mapData[0].length,
                height = mapData.length;

            if(width !== this.entityMap.width || height !== this.entityMap.height){
                this.entityMap.setSize(width, height);
            }

            // loop over each coord in the Array2d (val will be undefined)
            this.entityMap.each(function(val, x, y){
                var currentEntity = val;
                if(currentEntity){
                    if(replaceCurrentEntities){
                        this.remove(currentEntity);
                    } else {
                        return;
                    }
                }
                var char = mapData[y][x],
                    type = charToType[char];
                if(type !== void 0){
                    var entity = new RL.Entity(_this.game, type);
                    _this.add(x, y, entity);
                }
            });
        }
    };

    root.RL.EntityManager = EntityManager;

}(this));
