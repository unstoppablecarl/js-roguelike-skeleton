var mapData = [
    '##########',
    '#.....c.c#',
    '#.c......#',
    '#...Xc.c.#',
    '#..c.....#',
    '##########',
];
var array2d = array2dFromMapData(mapData);
var renderer = rendererFromArray2d(array2d);
var containerEl = document.getElementById('example-container');
// clear contents and append elements created by the game to the DOM
containerEl.innerHTML = '';
containerEl.appendChild(renderer.canvas);

var tiles = array2d.getWithinSquareRadius(4, 3, 2, function(val, x, y){
    return val && val.char === 'c';
});

for (var i = 0; i < tiles.length; i++) {
    tiles[i].bgColor = '#555';
}

// draw to show changes
renderer.draw();
