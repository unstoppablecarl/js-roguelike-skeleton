---
title: Targets
template: page-method.dust
nav_sort: 1
nav_groups: primary

related_methods:
 - Game
 - ValidTargets
 - ValidTargetsFinder

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
 - ../../../src/valid-targets.js
 - ../../../src/valid-targets-finder.js
 - ../../../src/game.js

scripts:
 - ../../js/make-basic-game.js
 - js/targets.js

example_content: Change Targets and Press the Space key to get target info. Note that one of the zombies is not a valid target (see code).
example_controls:
 -
    action: Move
    keys: ARROW_KEYS, W, A, S, D
 -
    action: Skip Turn
    keys: SPACE
 -
    action: Target Prev
    keys: COMMA
 -
    action: Target Next
    keys: PERIOD
---

<div id="example-container" class="game-container"></div>
<div id="example-console-container" class="game-container"></div>