var mapData = [
    '##########',
    '#.c.....b#',
    '#...a....#',
    '#.b...b..#',
    '#.......c#',
    '##########',
];
var array2d = array2dFromMapData(mapData);
var renderer = rendererFromArray2d(array2d);
var containerEl = document.getElementById('example-container');
// clear contents and append elements created by the game to the DOM
containerEl.innerHTML = '';
containerEl.appendChild(renderer.canvas);

// getNearest returns an array of all results.
var nearestCTiles = array2d.getNearest(4, 2, {
    maxRadius: 10,
    filter: function(val, x, y){
        return val && val.char === 'c';
    }
});
// in this case there is only one result
nearestCTiles[0].bgColor = 'green';

// There will be multiple results if mutiple coord values match and are the same closest distance away.
var nearestBTiles = array2d.getNearest(4, 2, {
    maxRadius: 10,
    filter: function(val, x, y){
        return val && val.char === 'b';
    }
});

// in this case there are 2 'b' tiles the same distance from the 'a' tile
for (var i = 0; i < nearestBTiles.length; i++) {
    var nearestB = nearestBTiles[i];
    nearestB.bgColor = 'green';
}

// draw to show changes
renderer.draw();
