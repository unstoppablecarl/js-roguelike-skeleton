var mapData = [
    '##########',
    '#........#',
    '#.Z......#',
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

array2d.remove(2, 2);

var aTile = array2d.get(4, 2); // {char: '.', bgColor: '#222', color: '#808080'}
aTile.char = 'a';
aTile.bgColor = '#444';

array2d.set(5, 4, {
    char: 'x',
    color: 'red'
});

// draw to show changes
renderer.draw();