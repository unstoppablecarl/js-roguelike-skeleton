(function(){
    'use strict';

    RL.Entity.Types.zombie = {
        name: 'Zombie',
        char: 'z',
        color: 'red',
        bgColor: false,
        bump: function(entity){
            // if bumping entity is the player
            if(entity === this.game.player){
                // @TODO combat logic here
                this.game.console.log('You killed Zombie');
                this.dead = true;
                return true;
            }
            return false;
        }
    };

    var mapData = [
        '##########',
        '#....Z...#',
        '#........#',
        '#...Z..Z.#',
        '#Z...Z...#',
        '##########',
    ];

    var entityCharToType = {
        'Z': 'zombie'
    };

    var settings = {
        mapData: mapData,
    };
    var game = makeBasicGame(settings);

    game.entityManager.loadFromArrayString(mapData, entityCharToType);

    game.start();

}());