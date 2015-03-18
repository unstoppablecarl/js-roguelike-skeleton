(function(){
    'use strict';

    // get original function
    var defaultOnKeyAction = RL.Game.prototype.onKeyAction;


    // override default code
    RL.Game.prototype.onKeyAction = function(action) {
        if(action === 'inspect'){
            var target = this.validTargets.getCurrent();
            if(target){
                var entity = target.value;
                this.console.log('Type:  ' + entity.name);
                this.console.log('X:     ' + target.x);
                this.console.log('Y:     ' + target.y);
                this.console.log('Range: ' + target.range);
            }

            return;
        }

        if(action === 'prev_target'){
            this.validTargets.prev();
            this.renderer.draw();
            return;
        }

        if(action === 'next_target'){
            this.validTargets.next();
            this.renderer.draw();
            return;
        }

        // call original code
        defaultOnKeyAction.call(this, action);
    };

    RL.RendererLayer.Types.targets = {

        // draw properties for maintainability
        borderColor: 'rgba(0, 200, 0, 0.5)',
        selectedBorderColor: 'rgba(0, 200, 0, 0.85)',
        borderWidth: 1,
        selectedBorderWidth: 2,

        getTileData: function(x, y, prevTileData){
            var targets = this.game.validTargets;
            var current = targets.getCurrent();
            var isCurrent = current && current.x === x && current.y === y;

            if(isCurrent){
                return {
                    borderColor: this.selectedBorderColor,
                    borderWidth: this.selectedBorderWidth,
                };
            } else {
                var targetsAtTile = targets.map.get(x, y);
                if(targetsAtTile.length){
                    return {
                        borderColor: this.borderColor,
                        borderWidth: this.borderWidth,
                    };
                }
            }
            return false;
        }
    };

    var mapData = [
        '##########',
        '#........#',
        '#......Z.#',
        '#....Z...#',
        '#.Z......#',
        '##########',
    ];

    var entityCharToType = {
        'Z': 'zombie'
    };

    var settings = {
        mapData: mapData,
        keyBindings: {
            up: ['UP_ARROW', 'K', 'W'],
            down: ['DOWN_ARROW', 'J', 'S'],
            left: ['LEFT_ARROW', 'H', 'A'],
            right: ['RIGHT_ARROW', 'L', 'D'],
            inspect: ['SPACE'],
            prev_target: ['COMMA'],
            next_target: ['PERIOD']
        },
    };
    var game = makeBasicGame(settings);

    game.entityManager.loadFromArrayString(mapData, entityCharToType);

    var validTargetsFinder = new RL.ValidTargetsFinder(game, {
        x: game.player.x,
        y: game.player.y,
        range: 10,
        validTypes: [RL.Entity],
        filter: function(target){
            if(target.excludeFromTargeting){
                return false;
            }
            return true;
        }
    });

    // create an entity that is excluded from targeting
    var excudedZombie = new RL.Entity(game, 'zombie');
    excudedZombie.excludeFromTargeting = true;
    game.entityManager.add(7, 4, excudedZombie);

    // add valid targets object to game
    game.validTargets = new RL.ValidTargets(game);

    game.renderer.layers = [
        new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
        new RL.RendererLayer(game, 'entity',    {draw: false,   mergeWithPrevLayer: true}),
        new RL.RendererLayer(game, 'targets',    {draw: true,   mergeWithPrevLayer: true}),
    ];

    // set player valid targets
    game.validTargets.setTargets(validTargetsFinder.getValidTargets());


    game.start();
    game.renderer.draw();

}());
