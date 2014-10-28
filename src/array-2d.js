(function(root) {
    'use strict';

    /**
    * Manages a 2d array of values mapped to x,y coords.
    * coord data methods to help with data maniuplation and searching (getAdjacent, findNearest, filter, getWithinSquareRadius etc.)
    * @class Array2d
    * @constructor
    * @param {Number} width - Width of the 2d Array.
    * @param {Number} height - Height of the 2d Array.
    */
    var Array2d = function(width, height) {
        this.width = width;
        this.height = height;
        this.reset();
    };

    Array2d.prototype = {
        constructor: Array2d,

        /**
        * Width of the 2d Array.
        * @property width
        * @type Number
        */
        width: null,

        /**
        * Height of the 2d Array.
        * @property height
        * @type Number
        */
        height: null,

        /**
        * 2d Array data
        * @property data
        * @type Array
        */
        data: null,

        /**
        * Resets the 2d array, clearing all data and initializing with `this.width` and `this.height`.
        * @method reset
        * @param {Number} width - The new width.
        * @param {Number} height - The new height.
        */
        reset: function() {
            this.data = [];
            for (var i = 0; i < this.width; i++) {
                this.data[i] = [];
            }
        },

        /**
        * Updates the size of this Array2d without destroying data.
        * @method setSize
        * @param {Number} width - The new width.
        * @param {Number} height - The new height.
        */
        setSize: function(width, height) {
            this.width = width;
            this.height = height;
            for (var i = 0; i < this.width; i++) {
                if(this.data[i] === void 0){
                    this.data[i] = [];
                }
            }
        },

        /**
        * Sets a value at given coords.
        * @method set
        * @param {Number} x - Map tile x coord of the value being set.
        * @param {Number} y - Map tile y coord of the value being set.
        * @param {Mixed} value - The value being set at given coords.
        */
        set: function(x, y, value) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return;
            }
            this.data[x][y] = value;
        },

        /**
        * Gets a value from given coords.
        * @method get
        * @param {Number} x - Map tile x coord of the value being retrieved.
        * @param {Number} y - Map tile y coord of the value being retrieved.
        * @return {Mixed}
        */
        get: function(x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return;
            }
            return this.data[x][y];
        },

        /**
        * Removes a value from given coords.
        * @method remove
        * @param {Number} x - Map tile x coord of the value being removed.
        * @param {Number} y - Map tile y coord of the value being removed.
        */
        remove: function(x, y) {
            this.set(x, y, void 0);
        },

        /**
        * Retrieves an array of values of adjacent coords.
        * @method getAdjacent
        * @param {Number} x - Map tile x coord to get adjacent values of.
        * @param {Number} y - Map tile y coord to get adjacent values of.
        * @param {Object} [settings] -
        * @param {Bool} [settings.withCoords=false] - If true the returned array will include the coords of each value ([{x: 0, y: 0, value: 1}, ...])
        * @param {Bool} [settings.withDiagonals=true] - If true diagonals will be included.
        * @param {Function} [settings.filter=false] - A function to filter the values returned (function(value, x, y){ return true;})
        * @return {Array} An array of adjacent coord values.
        */
        getAdjacent: function(x, y, settings) {
            settings = settings || {};
            var filter          = settings.filter           !== void 0 ? settings.filter        : false,
                withCoords      = settings.withCoords       !== void 0 ? settings.withCoords    : false,
                withDiagonals   = settings.withDiagonals    !== void 0 ? settings.withDiagonals : true;

            var _this = this,
                out = [],
                ax, ay;

            var add = function(x, y) {
                var val = _this.get(x, y);
                if (filter === false || (filter(val, x, y))) {
                    if (withCoords) {
                        out.push({
                            x: x,
                            y: y,
                            value: val
                        });
                    } else {
                        out.push(val);
                    }
                }
            };

            // top
            ax = x;
            ay = y - 1;
            add(ax, ay);

            // bottom
            ax = x;
            ay = y + 1;
            add(ax, ay);

            // left
            ax = x - 1;
            ay = y;
            add(ax, ay);

            // right
            ax = x + 1;
            ay = y;
            add(ax, ay);

            if(withDiagonals){
                // top left
                ax = x - 1;
                ay = y - 1;
                add(ax, ay);

                // top right
                ax = x + 1;
                ay = y - 1;
                add(ax, ay);

                // bottom left
                ax = x - 1;
                ay = y + 1;
                add(ax, ay);

                // bottom right
                ax = x + 1;
                ay = y + 1;
                add(ax, ay);
            }

            return out;
        },

        /**
        * Retrieves an array of values of coords within a given radius.
        * @method getWithinSquareRadius
        * @param {Number} x - Map tile x coord at the center of the radius.
        * @param {Number} y - Map tile x coord at the center of the radius.
        * @param {Object} [settings] -
        * @param {Number} [settings.radius=1] - Radius of the area to retrieve tiles from.
        * @param {Function} [settings.filter=false] - A function to filter the values returned (function(value, x, y){ return true;})
        * @param {Bool} [settings.withCoords=false] - If true the returned array will include the coords of each value ([{x: 0, y: 0, value: 1}, ...])
        * @param {Bool} [settings.includeTarget=false] - If true the value of the coordinates given will be included in the returned array.
        * @return {Array} An array of coord values within a square radius of the given coords.
        */
        getWithinSquareRadius: function(x, y, settings) {
            settings = settings || {};

            var radius          = settings.radius           || 1,
                filter          = settings.filter           || false,
                withCoords      = settings.withCoords       || false,
                includeTarget   = settings.includeTarget    || false;

            var tileX = x,
                tileY = y;
            var minX = tileX - radius,
                maxX = tileX + radius,
                minY = tileY - radius,
                maxY = tileY + radius,
                output = [],
                val;

            if (minX < 0) {
                minX = 0;
            }
            if (minY < 0) {
                minY = 0;
            }
            if (maxX > this.width - 1) {
                maxX = this.width - 1;
            }
            if (maxY > this.height - 1) {
                maxY = this.height - 1;
            }
            for (x = minX; x <= maxX; x++) {
                for (y = minY; y <= maxY; y++) {
                    if (!includeTarget && tileX === x && tileY === y) {
                        continue;
                    }
                    val = this.data[x][y];

                    if (filter === false || filter(val, x, y)) {
                        if (withCoords) {
                            output.push({
                                x: x,
                                y: y,
                                value: val
                            });
                        } else {
                            output.push(val);
                        }
                    }
                }
            }
            return output;
        },

        /**
        * Retrieves an array of values of coords along a line starting at point 0 and crossing point 1 until it hits the edge of the 2d array or a coord value returning true when passed to the condtion function.
        * @method getLineThrough
        * @param {Number} x0 - Map tile x coord of start.
        * @param {Number} y0 - Map tile y coord of start.
        * @param {Number} x1 - Map tile x coord of crossing.
        * @param {Number} y1 - Map tile y coord of crossing.
        * @param {Function} [condition=false] - A function to determine when to end the line. A coord value returning true when passed to the function will end the line. (function(value, x, y){ return true;})
        * @param {Bool} [withCoords=false] - If true the returned array will include the coords of each value ([{x: 0, y: 0, value: 1}, ...])
        * @return {Array} An array of coord values.
        */
        getLineThrough: function(x0, y0, x1, y1, condition, withCoords) {
            withCoords = withCoords || false;
            condition = condition || false;
            var output = [],
                dx = Math.abs(x1 - x0),
                dy = Math.abs(y1 - y0),
                sx = (x0 < x1) ? 1 : -1,
                sy = (y0 < y1) ? 1 : -1,
                err = dx - dy,
                e2, val;

            while (true) {
                if (x0 < 0 || x0 >= this.width || y0 < 0 || y0 >= this.height) {
                    break;
                }

                val = this.get(x0, y0);
                if (withCoords) {
                    output.push({
                        x: x0,
                        y: y0,
                        value: val
                    });
                } else {
                    output.push(val);
                }

                if (condition !== false && condition(val, x0, y0)) {
                    break;
                }

                e2 = 2 * err;
                if (e2 > -dy) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y0 += sy;
                }
            }
            return output;
        },

        /**
        * Retrieves an array of the nearest coord values meeting checked requirements. If multiple coord values were matched at the same nearest distance, the returned array will contain multiple matched coord values.
        * Used for projecting path of ranged attacks, pushed entities, ect.
        * @method getNearest
        * @param {Number} tileX - Map tile x coord of the center of the radius.
        * @param {Number} tileY - Map tile x coord of the center of the radius.
        * @param {Object} [settings] -
        * @param {Number} [settings.maxRadius=1] - Maxium search radius from given coord.
        * @param {Function} [settings.filter=false] - A function to determine when the desired coord value is matched. A coord value returning true when passed to the function would be added to the list of results. (function(value, x, y){ return true;}) If no check function is provided any tile with a truthy value will be matched.
        * @param {Bool} [settings.withCoords=false] - If true the returned array will include the coords of each value ([{x: 0, y: 0, value: 1}, ...])
        * @return {Array} An array of coord values within a square radius of the given coords.
        */
        getNearest: function(startX, startY, settings) {
            settings = settings || {};

            var maxRadius   = settings.maxRadius    || 1,
                filter      = settings.filter       || false,
                withCoords  = settings.withCoords    || false;

            var currentDistance = 1,
                results = [],
                x, y;

            var checkVal = function(val, x, y) {
                var result;
                if ((filter && filter(val, x, y)) || (!filter && val)) {
                    if (withCoords) {
                        results.push({
                            x: x,
                            y: y,
                            value: val
                        });
                    } else {
                        return results.push(val);
                    }
                }
            };

            while (currentDistance <= maxRadius) {

                var minX = startX - currentDistance,
                    maxX = startX + currentDistance,
                    minY = startY - currentDistance,
                    maxY = startY + currentDistance,
                    len = currentDistance * 2 + 1;

                for (var i = len - 1; i >= 0; i--) {

                    var val;

                    // top and bottom edges skip first and last coords to prevent double checking
                    if (i < len - 1 && i > 0) {
                        // top edge
                        if (minY >= 0) {
                            x = minX + i;
                            y = minY;
                            val = this.get(x, y);
                            checkVal(val, x, y);

                        }

                        if (maxY < this.height) {
                            // bottom edge
                            x = minX + i;
                            y = maxY;
                            val = this.get(x, y);
                            checkVal(val, x, y);
                        }
                    }

                    if (minX >= 0) {
                        // left edge
                        x = minX;
                        y = minY + i;
                        val = this.get(x, y);
                        checkVal(val, x, y);
                    }

                    if (maxX < this.width) {
                        // right edge
                        x = maxX;
                        y = minY + i;
                        val = this.get(x, y);
                        checkVal(val, x, y);
                    }
                }
                if (results.length) {
                    return results;
                }
                currentDistance++;
            }

            return false;
        },

        /**
        * Retrieves an array of the filtered values.
        * @method filter
        * @param {Function} filter - A function to determine if a value is to be included in results (returns true). (function(value, x, y){ return true;})
        * @param {Bool} [withCoords=false] - If true the returned array will include the coords of each value ([{x: 0, y: 0, value: 1}, ...])
        * @return {Array} An array of coord values matched by the filter function.
        */
        filter: function(filter, withCoords){
            withCoords = withCoords || false;
            var output = [];
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var val = this.get(x, y);
                    if(filter(val, x, y)){
                        if (withCoords) {
                            output.push({
                                x: x,
                                y: y,
                                value: val
                            });
                        } else {
                            output.push(val);
                        }
                    }
                }
            }
            return output;
        },

        /**
        * Creates a copy of this Array2d. Shallow copies values.
        * @method copy
        * @return {Array2d}
        */
        copy: function(){
            var newArray = new Array2d(this.width, this.height);
            for(var x = this.width - 1; x >= 0; x--){
                for(var y = this.height - 1; y >= 0; y--){
                    var val = this.get(x, y);
                    if(val !== void 0){
                        newArray.set(x, y, val);
                    }
                }
            }
            return newArray;
        },

        /**
        * Loops over each coord value.
        * @method each
        * @param {Function} func - A function to call on each coord value. (function(value, x, y){})
        * @param {Object} [context] - Context to call the function with (func.call(context, val, x, y))
        * @return {Array2d}
        */
        each: function(func, context){
            for(var x = this.width - 1; x >= 0; x--){
                for(var y = this.height - 1; y >= 0; y--){
                    var val = this.get(x, y);
                    if(context){
                        func.call(context, val, x, y);
                    } else {
                        func(val, x, y);
                    }
                }
            }
        }
    };

    root.RL.Array2d = Array2d;

}(this));
