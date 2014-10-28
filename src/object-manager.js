(function(root) {
    'use strict';

    /**
    * Manages a list of all objects and their tile positions.
    * Handles adding, removing, moving objects within the game.
    * @class ObjectManager
    * @constructor
    * @param {Game} game - Game instance this `ObjectManager` is attached to.
    * @param {Object} ObjectConstructor - Object constructor used to create new objects with `this.add()`.
    * @param {Number} [width] - Width of current map in tiles.
    * @param {Number} [height] - Height of current map in tiles.
    */
    var ObjectManager = function ObjectManager(game, ObjectConstructor, width, height) {
        this.game = game;
        this.ObjectConstructor = ObjectConstructor;
        this.objects = [];
        this.map = new RL.Array2d(width, height);
    };

    ObjectManager.prototype = {
        constructor: ObjectManager,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type {Game}
        */
        game: null,

        /**
        * Array containing all objects.
        * @property objects
        * @type {Array}
        */
        objects: null,

        /**
        * Array2d containing all objects by their current map tile coord
        * @property map
        * @type {Array2d}
        */
        map: null,

        /**
        * Retrieves an entity by map tile coords.
        * @method get
        * @param {Number} x - The tile map coord x.
        * @param {Number} y - The tile map coord y.
        * @return {Object|false}
        */
        get: function(x, y) {
            return this.map.get(x, y);
        },

        /**
        * Adds an object to the manager at given map tile coord.
        * If an object is already at this map tile coord it is removed from the manager completely.
        * @method add
        * @param {Number} x - The tile map coord x.
        * @param {Number} y - The tile map coord y.
        * @param {Object|String} obj - The Object being set at given coords. If obj is a string a new Object will be created using `this.makeNewObjectFromType(obj)`.
        * @return {Object} The added object.
        */
        add: function(x, y, obj) {
            if(typeof obj === 'string'){
                obj = this.makeNewObjectFromType(obj);
            }
            var existing = this.get(x, y);
            if(existing){
                this.remove(existing);
            }
            obj.game = this.game;
            obj.x = x;
            obj.y = y;
            this.objects.push(obj);
            this.map.set(x, y, obj);
            return obj;
        },

        /**
        * Removes an object from the manager.
        * @method remove
        * @param {Object} object - The objectity to be removed.
        */
        remove: function(object) {
            this.map.remove(object.x, object.y);
            var index = this.objects.indexOf(object);
            this.objects.splice(index, 1);
        },

        /**
        * Changes the position of an object already added to this objectManager.
        * @method move
        * @param {Number} x - The destination tile map coord x.
        * @param {Number} y - The destination tile map coord y.
        * @param {Obj} object - The objectity to be removed.
        */
        move: function(x, y, object) {
            var existing = this.get(object.x, object.y);
            if(existing !== object || this.objects.indexOf(object) === -1){
                throw new Error({error: 'Attempting to move object not in Object manager', x: x, y: y, object: object});
            }
            this.map.remove(object.x, object.y);
            object.x = x;
            object.y = y;
            this.map.set(x, y, object);
        },

        /**
        * Resets this entityManager.
        * @method reset
        */
        reset: function() {
            this.objects = [];
            this.map.reset();
        },

        /**
        * Sets the size of the map to manage objects within.
        * @method setSize
        * @param {Number} width - Width of current map in tiles.
        * @param {Number} height - Height of current map in tiles.
        */
        setSize: function(width, height){
            this.map.setSize(width, height);
        },

        /**
        * Loads object data from an array of strings.
        * @method loadEntitiesFromArrayString
        * @param {Array} mapData - The array of strings to load.
        * @param {Object} charToType - An object mapping string characters to Object types see `this.makeNewObjectFromType()`. Characters in mapData not in charToType are ignored.
        * @param {String} [defaultType] - If set, all characters in `mapData` not found in `charToType` will be replaced by an object with `defaultType`.
        * @param {Bool} [replaceCurrentObjects=false] - If true current objects at positons of objects being added will be removed. Otherwise new objects at occupied positions will not be added.
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
        loadFromArrayString: function(mapData, charToType, defaultType, replaceCurrentObjects){
            var _this = this,
                width = mapData[0].length,
                height = mapData.length;

            if(width !== this.map.width || height !== this.map.height){
                this.map.setSize(width, height);
            }

            // loop over each coord in the Array2d (val will be undefined)
            this.map.each(function(val, x, y){
                var currentObj = val;
                if(currentObj){
                    if(replaceCurrentObjects){
                        this.remove(currentObj);
                    } else {
                        return;
                    }
                }
                var char = mapData[y][x],
                    type = charToType[char];
                if(type === void 0 && defaultType){
                    type = defaultType;
                }
                if(type !== void 0){
                    var entity = _this.makeNewObjectFromType(type);
                    _this.add(x, y, entity);
                }
            });
        },

        /**
         * Creates a new object instance of given type.
         * @method makeNewObjectFromType
         * @param {String} type - The type to make the object
         * @return {Object}
         */
        makeNewObjectFromType: function(type){
            return new this.ObjectConstructor(this.game, type);
        },

        /**
        * Calls the `object.update()` method on all objects. Removes `object.dead == true` objects.
        * Typically called after a player has resolved their actions.
        * Not all object managers need to upade the objects they manage.
        * @param {Object} [excludeObject] - excludeObject will be skipped if found in `this.objects`.
        * @method update
        */
        update: function(excludeObject) {
            // count down for performance and so we can remove things as we go
            for (var i = this.objects.length - 1; i >= 0; i--) {
                var obj = this.objects[i];
                if(excludeObject === obj){
                    continue;
                }
                if (obj.dead) {
                    this.remove(obj);
                    continue;
                }
                if(obj.update){
                    obj.update();
                }
            }
        },
    };

    root.RL.ObjectManager = ObjectManager;

}(this));
