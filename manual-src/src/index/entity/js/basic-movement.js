(function(){
    'use strict';

    // Define an Entity Type
    RL.Entity.Types.zombie = {
        name: 'Zombie',
        char: 'z',
        color: 'red',
        bgColor: false,
        currentDirection: 'right',
        light_r: 100,
        light_g: 100,
        light_b: 255,

        /**
        * Gets the adjustment coord from a direction string.
        * @method directionToAdjustCoord
        * @param {String} direction - The current direction.
        * @return {Object} {x: 0, y: 0}
        */
        directionToAdjustCoord: function(direction){
            var directionCoords = {
                up:     {x: 0, y:-1},
                right:  {x: 1, y: 0},
                down:   {x: 0, y: 1},
                left:   {x:-1, y: 0}
            };
            return directionCoords[direction];
        },

        /**
        * Gets the next direction in the list
        * @method getNextDirection
        * @param {String} direction - The current direction.
        * @return {String}
        */
        getNextDirection: function(currentDirection){
            var directions = ['up', 'right', 'down', 'left'],
                currentDirIndex = directions.indexOf(currentDirection),
                newDirIndex;
            // if currentDirection is not valid or is the last in the array use the first direction in the array
            if(currentDirIndex === -1 || currentDirIndex === directions.length - 1){
                newDirIndex = 0;
            } else {
                newDirIndex = currentDirIndex + 1;
            }
            return directions[newDirIndex];
        },

        /**
        * Called every turn by the entityManger (entity turns are triggered after player actions are complete)
        * @method update
        */
        update: function(){
            var startDir = this.currentDirection,
                currentDir = this.currentDirection;

            var i = 0;
            while(i < 6){
                i++;
                var currentDirAdjustCoords = this.directionToAdjustCoord(currentDir),
                    targetX = this.x + currentDirAdjustCoords.x,
                    targetY = this.y + currentDirAdjustCoords.y;

                if(this.canMoveTo(targetX, targetY)){
                    this.currentDirection = currentDir;
                    this.moveTo(targetX, targetY);
                    return;
                }
                currentDir = this.getNextDirection(currentDir);
                // give up if all directions attempted
                if(currentDir === startDir){
                    return false;
                }
            }
        },

        /**
        * Changes the position of this entity on the map.
        * @method moveTo
        * @param {Number} x - The tile map x coord to move to.
        * @param {Number} y - The tile map y coord to move to.
        */
        moveTo: function(x, y) {
            // remove light from current position
            if(this.game.lighting.get(this.x, this.y)){
                this.game.lighting.remove(this.x, this.y);
            }
            // add to new position
            this.game.lighting.set(x, y, this.light_r, this.light_g, this.light_b);

            RL.Entity.prototype.moveTo.call(this, x, y);
        },
    };

    var mapData = [
        '##########',
        '#........#',
        '#........#',
        '#........#',
        '#........#',
        '##########',
    ];

    var settings = {
        mapData: mapData
    };
    var game = makeBasicGame(settings);

    // create an instance of entity with the type zombie
    var entity = new RL.Entity(game, 'zombie');
    // add it to the game
    game.entityManager.add(1, 1, entity);
    // use moveTo to create light initially
    entity.moveTo(1, 1);
    game.start();

}());