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

    var validTargetBorderColor = 'rgba(0, 200, 0, 0.5)',
        validTargetSelectedBorderColor = 'rgba(0, 200, 0, 0.85)',
        validTargetBorderWidth = 1,
        validTargetSelectedBorderWidth = 2;

    RL.Renderer.prototype.drawExtra = function(ctx, map, entityManager, player, fov, lighting){
        ctx = ctx || this.bufferCtx;
        var validTargets = this.game.validTargets,
            selected = validTargets.getCurrent();

        for(var i = validTargets.targets.length - 1; i >= 0; i--){
            var target = validTargets.targets[i],
                x = target.x,
                y = target.y,
                borderColor = validTargetBorderColor,
                borderWidth = validTargetBorderWidth;
            if(target === selected){
                borderColor = validTargetSelectedBorderColor;
                borderWidth = validTargetSelectedBorderWidth;
            }
            var tileData = {
                char: false,
                borderColor: borderColor,
                borderWidth: borderWidth,
            };
            this.drawTile(x, y, tileData, ctx);
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

    game.entityManager.loadEntitiesFromArrayString(mapData, entityCharToType);

    var validTargetsFinder = new RL.ValidTargetsFinder(game, game.player, {
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
    game.validTargets = new RL.ValidTargets();

    game.start();

    // set player valid targets
    game.validTargets.targets = validTargetsFinder.getValidTargets();
    game.renderer.draw();

}());
