var mapData = [
    '##########',
    '#........#',
    '#........#',
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
renderer.draw();