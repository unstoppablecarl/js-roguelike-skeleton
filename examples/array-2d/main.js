

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
    var renderer = new RL.Renderer();
    // make the tiles big
    renderer.tileSize = 20;
    // set the view width and height (in this case we want to see the whole map so it is the same as the map width)
    renderer.resize(array2d.width, array2d.height);
    return renderer;
};

// var btn1 = document.getElementById('btn-ex-1');
// var ex1 =  document.getElementById('ex-1');
// btn1.addEventListener('click', function(e){
//     e.preventDefault();
//     eval(ex1.value);
// });




// var setup = function(mapData, array2d, renderer){


//     var btn = document.getElementById(btnId);
//     var exCode =  document.getElementById(codeId);

//     btn.addEventListener('click', function(e){
//         e.preventDefault();
//         eval(ex.value);


//     });

//     var width = mapData[0].length,
//         height = mapData.length;

//     var array2d = new RL.Array2d(width, height);

//     // loop over each coord in the Array2d (val will be undefined)
//     array2d.each(function(val, x, y){
//         var char = mapData[y][x];
//         var tileData = {
//             char: char,
//             bgColor: '#222',
//             color: '#fff'
//         };
//         if(char === '.'){
//             tileData.color = '#808080';
//         }
//         else if(char === '#'){
//             tileData.color = '#fff';
//         }
//         else if(char === 'a'){
//             tileData.color = 'red';
//         }
//         else if(char === 'b'){
//             tileData.color = 'blue';
//         }
//         else if(char === 'c'){
//             tileData.color = 'yellow';
//         }
//         // set value at coord
//         array2d.set(x, y, tileData);
//     });

//     var renderer = new RL.Renderer();
//     // make the tiles big
//     renderer.tileSize = 20;
//     // set the view width and height (in this case we want to see the whole map so it is the same as the map width)
//     renderer.resize(width, height);
//     // draw the array2d
//     renderer.draw(array2d);
// };

// var mapData = [
//     '##########',
//     '#.c.....b#',
//     '#...a....#',
//     '#.b...b..#',
//     '#.......c#',
//     '##########',
// ];


// // get existing DOM elements
// var containerEl = document.getElementById('container');

// // append elements created by the game to the DOM
// containerEl.appendChild(renderer.canvas);




// // get the 'a' tile
// var aTile = array2d.get(4, 2); // {char: 'a', bgColor: '#222', color: 'red'}
// // change the bgColorof a tile
// aTile.bgColor = '#444';
// // draw to show changes
// renderer.draw(array2d);


// // get the 'a' tile
// var adjacentTiles = array2d.getAdjacent(4, 2);
// for (var i = 0; i < adjacentTiles.length; i++) {
//     adjacentTiles[i].bgColor = '#555';
// }
// // draw to show changes
// renderer.draw(array2d);

// // findNearest returns an array of all results.
// // There will be multiple results if mutiple coord values match and are the same closest distance away.
// var nearestBTiles = array2d.findNearest(4, 2, 10, function(val, x, y){
//     return val && val.char === 'b';
// });

// // in this case there are 2 'b' tiles the same distance from the 'a' tile
// for(var i = nearestBTiles.length - 1; i >= 0; i--){
//     var nearestB = nearestBTiles[i];
//     nearestB.bgColor = 'green';
// }
// // draw to show changes
// renderer.draw(array2d);


// // findNearest returns an array of all results.
// var nearestCTiles = array2d.findNearest(4, 2, 10, function(val, x, y){
//     return val && val.char === 'c';
// });
// // in this case there is only one result
// nearestCTiles[0].bgColor = 'green';
// // draw to show changes
// renderer.draw(array2d);



