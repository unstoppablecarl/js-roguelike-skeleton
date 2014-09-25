---
title: Basic Movement Behavior
template: page-method.dust
nav_sort: 1
nav_groups: primary

related_methods:
 - Game
 - Entity

vendor_scripts:
 - ../../assets/js/rot.js

lib_scripts:
 - ../../../src/rl.js
 - ../../../src/util.js
 - ../../../src/array-2d.js
 - ../../../src/map.js
 - ../../../src/entity.js
 - ../../../src/entity-manager.js
 - ../../../src/input.js
 - ../../../src/mouse.js
 - ../../../src/player.js
 - ../../../src/renderer.js
 - ../../../src/tile.js
 - ../../../src/console.js
 - ../../../src/fov-rot.js
 - ../../../src/lighting-rot.js
 - ../../../src/game.js

scripts:
 - ../../js/make-basic-game.js
 - js/basic-movement.js

example_content: Move the player around and watch how the zombie behaves. Move with the W, A, S, D instead of arrow keys to avoid scrolling the window. Use SPACE to skip the players turn. Just for fun a light that follows the zombie has been added.

---

<div id="example-container" class="game-container"></div>
