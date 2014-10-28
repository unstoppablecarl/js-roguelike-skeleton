var mapData = [
    '##########',
    '#........#',
    '#........#',
    '#....b...#',
    '#.a......#',
    '##########',
];
var array2d = array2dFromMapData(mapData);
var renderer = rendererFromArray2d(array2d);
var containerEl = document.getElementById('example-container');
// clear contents and append elements created by the game to the DOM
containerEl.innerHTML = '';
containerEl.appendChild(renderer.canvas);

var a = {
    x: 2,
    y: 4
};
var b = {
    x: 5,
    y: 3
};

var tiles = array2d.getLineThrough(a.x, a.y, b.x, b.y, function(val, x, y){
    // stop at wall
    return val && val.char === '#';
});

for (var i = 0; i < tiles.length; i++) {
    tiles[i].bgColor = '#555';
}

// draw to show changes
renderer.draw();
