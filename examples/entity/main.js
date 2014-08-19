

var array2dFromMapData = function(game, mapData){
    var width = mapData[0].length,
        height = mapData.length;
    var array2d = new RL.Array2d(width, height);
    // loop over each coord in the Array2d (val will be undefined)
    array2d.each(function(val, x, y){
        var char = mapData[y][x];
        var tileData = {
            char: char,
            bgColor: '#222',
            color: '#fff'
        },
        tileType;
        if(char === '.'){
            tileType = 'floor';
        }
        else if(char === '#'){
            tileType = 'wall';
        }
        var tile = new RL.Tile(game, tileType, x, y);

        // set value at coord
        array2d.set(x, y, tile);
    });

    return array2d;
};



var initBasicGame = function(mapContainerEl, mapData){

    var keyBindings = {
        up: ['UP_ARROW', 'K', 'W'],
        down: ['DOWN_ARROW', 'J', 'S'],
        left: ['LEFT_ARROW', 'H', 'A'],
        right: ['RIGHT_ARROW', 'L', 'D'],
        wait: ['SPACE']
    };

    // create the game instance
    var game = new RL.Game();
    // generate and assign a map object (repaces empty default)
    game.map = array2dFromMapData(game, mapData);

    game.setMapSize(game.map.width, game.map.height);

    // add input keybindings
    game.input.addBindings(keyBindings);

    // set player starting position
    game.player.x = 5;
    game.player.y = 3;

    // append elements created by the game to the DOM
    mapContainerEl.appendChild(game.renderer.canvas);

    return game;
};




