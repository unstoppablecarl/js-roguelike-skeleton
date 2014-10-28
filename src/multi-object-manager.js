(function(root) {
    'use strict';

    /**
    * Manages a list of object and their tile positions.
    * Multiple objects can be at a given tile map coord.
    * Handles adding, removing, moving objects within the game.
    * @class MultiObjectManager
    * @constructor
    * @param {Game} game - Game instance this `MultiObjectManager` is attached to.
    * @param {Object} ObjectConstructor - Object constructor used to create new objects with `this.add()`.
    * @param {Number} [width] - Width of current map in tiles.
    * @param {Number} [height] - Height of current map in tiles.
    */
    var MultiObjectManager = function MultiObjectManager(game, ObjectConstructor, width, height) {
        this.game = game;
        this.ObjectConstructor = ObjectConstructor;
        this.objects = [];
        this.map = new RL.Array2d();
        this.setSize(width, height);

        var map = this.map;
        this.map.each(function(val, x, y){
            map.set(x, y, []);
        });
    };

    MultiObjectManager.prototype = {
        constructor: MultiObjectManager,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Array containing all objects.
        * @property objects
        * @type Array
        */
        objects: null,

        /**
        * Array2d containing all objects by their current map tile coord
        * @property map
        * @type Array2d
        */
        map: null,

        /**
        * Retrieves all objects at given map tile coord.
        * @method get
        * @param {Number} x - The tile map x coord.
        * @param {Number} y - The tile map y coord.
        * @param {Function} [filter] - A function to filter the array of objects returned `function(object){  return true }`.
        * @return {Array}
        */
        get: function(x, y, filter) {
            if(filter){
                return this.map.get(x, y).filter(filter);
            }
            return this.map.get(x, y);
        },

        /**
        * Retrieves the first object in array at given map tile coord.
        * @method getFirst
        * @param {Number} x - The tile map x coord.
        * @param {Number} y - The tile map y coord.
        * @param {Function} [filter] - A function to filter the object returned at this map tile coord `function(object){  return true }`. The first object in the array the filter matches is returned.
        * @return {Object}
        */
        getFirst: function(x, y, filter){
            var arr = this.map.get(x, y);
            if(arr){
                if(filter){
                    var len = arr.length;
                    for (var i = 0; i < len; i++) {
                        var item = arr[i];
                        if(filter(item)){
                            return item;
                        }
                    }
                } else {
                    return arr[0];
                }
            }
        },

        /**
        * Retrieves the last object in array at given map tile coord.
        * @method getLast
        * @param {Number} x - The tile map x coord.
        * @param {Number} y - The tile map y coord.
        * @param {Function} [filter] - A function to filter the object returned at this map tile coord `function(object){  return true }`. The last object in the array the filter matches is returned.
        * @return {Object}
        */
        getLast: function(x, y, filter){
            var arr = this.map.get(x, y);
            if(arr){
                if(filter){
                    for(var i = arr.length - 1; i >= 0; i--){
                        var item = arr[i];
                        if(filter(item)){
                            return item;
                        }
                    }
                } else {
                    return arr[arr.length - 1];
                }
            }
        },

        /**
        * Adds an object to the manager at given map tile coord. Multiple objects can be added to the same coord.
        * @method add
        * @param {Number} x - Map tile coord x.
        * @param {Number} y - Map tile coord y.
        * @param {Object|String} obj - The Object being set at given coords. If `obj` is a string a new Object will be created using `this.makeNewObjectFromType(obj)`.
        * @return {Object} The added object.
        */
        add: function(x, y, obj) {
            if(typeof obj === 'string'){
                obj = this.makeNewObjectFromType(obj);
            }
            obj.game = this.game;
            obj.x = x;
            obj.y = y;
            this.objects.push(obj);
            var arr = this.map.get(x, y);
            arr.push(obj);
            return obj;
        },

        /**
        * Removes an entity from the manager.
        * @method remove
        * @param {Obj} obj - The objity to be removed.
        */
        remove: function(obj) {
            var arr = this.map.get(obj.x, obj.y);
            var index = arr.indexOf(obj);
            arr.splice(index, 1);
            index = this.objects.indexOf(obj);
            this.objects.splice(index, 1);
        },

        /**
        * Changes the position of an entity already added to this entityManager.
        * @method move
        * @param {Number} x - The new map tile coordinate position of the entity on the x axis.
        * @param {Number} y - The new map tile coordinate position of the entity on the y axis.
        * @param {Obj} object - The objectity to be removed.
        */
        move: function(x, y, object) {
            this.remove(object);
            object.x = x;
            object.y = y;
            this.add(x, y, object);
        },

        /**
        * Resets this entityManager.
        * @method reset
        */
        reset: function() {
            this.objects = [];
            this.map.reset();
            var map = this.map;
            this.map.each(function(val, x, y){
                map.set(x, y, []);
            });
        },

        /**
        * Sets the size of the map to manage objects within.
        * @method setSize
        * @param {Number} width - Width of current map in tiles.
        * @param {Number} height - Height of current map in tiles.
        */
        setSize: function(width, height){
            this.map.setSize(width, height);
            var map = this.map;
            this.map.each(function(val, x, y){
                if(val === void 0){
                    map.set(x, y, []);
                }
            });
        },

        /**
         * Same as `this.map.getAdjacent`, but merges all results into on flat array.
         * @method getAdjacent
         * @param {Number} x
         * @param {Number} y
         * @param {Object} settings
         * @return {Array}
         */
        getAdjacent: function(x, y, settings){
            settings = settings || {};
            if(settings.filter){
                var filter = settings.filter;
                settings.filter = function(objects){
                    return objects.filter(filter);
                };
            }
            var results = this.map.getAdjacent(x, y, settings);
            var out = [];
            // merge all arrays
            return out.concat.apply(out, results);
        },

        /**
        * Loads Obj data from an array of strings.
        * @method loadEntitiesFromArrayString
        * @param {Array} mapData - The array of strings to load.
        * @param {Object} charToType - An object mapping string characters to Obj types (see Obj.Types[type]). Characters in mapData not in charToType are ignored.
        * @param {String} [defaultType] - If set, all characters in `mapData` not found in `charToType` will be replaced by an object with `defaultType`.
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
        loadFromArrayString: function(mapData, charToType, defaultType){
            var _this = this,
                width = mapData[0].length,
                height = mapData.length;

            if(width !== this.map.width || height !== this.map.height){
                this.setSize(width, height);
            }

            // loop over each coord in the Array2d (val will be undefined)
            this.map.each(function(val, x, y){
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
         * Creates a new object instance.
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

    root.RL.MultiObjectManager = MultiObjectManager;

}(this));
