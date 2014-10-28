var makeBasicGame = function(settings){

    var defaultSettings = {
        mapContainerEl: document.getElementById('example-container'),
        consoleContainerEl: document.getElementById('example-console-container'),
        mapData: [
            // 10x6
            '##########',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '##########',
        ],
        mapCharToType: {
            '#': 'wall',
            '.': 'floor',
            '+': 'door',
        },
        keyBindings: {
            up: ['UP_ARROW', 'K', 'W'],
            down: ['DOWN_ARROW', 'J', 'S'],
            left: ['LEFT_ARROW', 'H', 'A'],
            right: ['RIGHT_ARROW', 'L', 'D'],
            wait: ['SPACE']
        },
        playerStartX: 2,
        playerStartY: 2,
        rendererWidth: 14,
        rendererHeight: 14
    };

    var s = RL.Util.mergeDefaults(defaultSettings, settings);

    // create the game instance
    var game = new RL.Game();

    game.map.loadTilesFromArrayString(s.mapData, s.mapCharToType, 'floor');

    game.setMapSize(game.map.width, game.map.height);

    // add input keybindings
    game.input.addBindings(s.keyBindings);

    // set player starting position
    game.entityManager.add(s.playerStartX, s.playerStartY, game.player);
    game.renderer.resize(s.rendererWidth, s.rendererHeight);

    // append elements created by the game to the DOM
    s.mapContainerEl.appendChild(game.renderer.canvas);

    if(s.consoleContainerEl){
        s.consoleContainerEl.appendChild(game.console.el);
    }

    game.renderer.layers = [
        new RL.RendererLayer(game, 'map',       {draw: false,   mergeWithPrevLayer: false}),
        new RL.RendererLayer(game, 'entity',    {draw: true,   mergeWithPrevLayer: true}),
    ];

    return game;
};