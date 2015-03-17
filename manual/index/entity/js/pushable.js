(function(){
    'use strict';

    RL.Entity.Types.statue = {
        name: 'Statue',
        char: 's',
        color: '#808080',
        bgColor: '#222',

        bump: function(entity){
            // bumping entity is the player
            if(entity === this.game.player){
                var pusherX = entity.x,
                    pusherY = entity.y,
                    directionX = this.x - pusherX,
                    directionY = this.y - pusherY,
                    targetX = this.x + directionX,
                    targetY = this.y + directionY;

                // check if can be pushed into destination
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
                        return true;
                    }
                }
            }
            return false;
        }
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

    var entity = new RL.Entity(game, 'statue');
    // add it to the game
    game.entityManager.add(4, 2, entity);

    game.start();

}());