---
title: Basic Combat
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
 - js/basic-combat.js

example_content: Move the player into the zombie entities.
example_controls:
 -
    action: Move
    keys: ARROW_KEYS, W, A, S, D
 -
    action: Skip Turn
    keys: SPACE
---

<div id="example-container" class="game-container"></div>
<div id="example-console-container" class="game-container"></div>