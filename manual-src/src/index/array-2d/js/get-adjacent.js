var mapData = [
    '##########',
    '#........#',
    '#...X....#',
    '#........#',
    '#........#',
    '##########',
];
var array2d = array2dFromMapData(mapData);
var renderer = rendererFromArray2d(array2d);
var containerEl = document.getElementById('example-container');
// clear contents and append elements created by the game to the DOM
containerEl.innerHTML = '';
containerEl.appendChild(renderer.canvas);

var adjacentTiles = array2d.getAdjacent(4, 2);
for (var i = 0; i < adjacentTiles.length; i++) {
    adjacentTiles[i].bgColor = '#555';
}

// draw to show changes
renderer.draw();
