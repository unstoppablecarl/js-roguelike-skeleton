var array2dFromMapData = function(mapData){
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
        };
        if(char === '.'){
            tileData.color = '#808080';
        }
        else if(char === '#'){
            tileData.color = '#fff';
        }
        else if(char === 'a'){
            tileData.color = 'red';
        }
        else if(char === 'b'){
            tileData.color = 'blue';
        }
        else if(char === 'c'){
            tileData.color = 'yellow';
        }
        // set value at coord
        array2d.set(x, y, tileData);
    });

    return array2d;
};

var rendererFromArray2d = function(array2d){
    RL.RendererLayer.Types.basic_map = {
        mergeWithPrevLayer: false,
        draw: true,
        getTileData: function(x, y, prevTileData){
            var tile = array2d.get(x, y);
            if(!tile){
                return false;
            }
            return tile;
        }
    };


    var renderer = new RL.Renderer();
    // make the tiles big
    renderer.tileSize = 20;
    // set the view width and height (in this case we want to see the whole map so it is the same as the map width)
    renderer.resize(array2d.width, array2d.height);

    renderer.layers = [
        new RL.RendererLayer(null, 'basic_map')
    ];

    return renderer;
};