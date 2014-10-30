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
 - ../../../src/mixins.js
 - ../../../src/array-2d.js
 - ../../../src/map.js
 - ../../../src/entity.js
 - ../../../src/input.js
 - ../../../src/mouse.js
 - ../../../src/player.js
 - ../../../src/renderer.js
 - ../../../src/renderer-layer.js
 - ../../../src/tile.js
 - ../../../src/console.js
 - ../../../src/fov-rot.js
 - ../../../src/lighting-rot.js
 - ../../../src/object-manager.js
 - ../../../src/multi-object-manager.js
 - ../../../src/game.js

scripts:
 - ../../js/make-basic-game.js
 - js/basic-movement.js

example_content: Move the player around and watch how the zombie behaves. Just for fun a light that follows the zombie has been added.
example_controls:
 -
    action: Move
    keys: ARROW_KEYS, W, A, S, D
 -
    action: Skip Turn
    keys: SPACE
---

<div id="example-container" class="game-container"></div>
