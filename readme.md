# JS Roguelike Skeleton

A roguelike micro-framework for JS beginners. Designed to give a well designed and organized starting point for developers new to programming and or JS. It does NOT provide map generation tools, other libraries like rot.js can be used to serve that purpose.

## [Examples and API Docs](http://unstoppablecarl.github.io/js-roguelike-skeleton/)

### Features

- Game
    - container for all game objects
    - handles updating state of game objects each turn
    - listens for player input to trigger and resolve new turns

- Array2d
    - 2 dimensional array data management (x,y coord data)
    - manages values set at specific x,y coords
    - coord data maniuplation and searching (getAdjacent, findNearest, filter, getWithinSquareRadius etc.)

- Console
    - display messages in a log format using html
    - "The troll hits you dealing 10 damage."
    - "You die."

- Entity
    - object representing a game element usually a character or enemy
    - occupies a single game map tile
    - drawing settings (color, character, bg color, etc)
    - manages state (position, health, stats, etc)

- EntityManager
    - maintains a list of all entities and their tile positions
    - handles adding, removing, moving entities within the game

- Player
    - object representing the player of the game (very similar to entity)
    - handles functionality triggered and converted by Input
    - handles functionality triggered by Mouse events

- Fov
    - caculates map tiles visible from a given x,y tile coord
    - stores visible map tiles for reference (ex: lookup and render tiles visible to player this turn)

- Renderer
    - renders the current game state using html5 canvas

- Tile
    - represents a single map tile
    - display data color, character etc.
    - state data blocksLos, passable, etc.

- Input
    - converts key code input to readable strings like 'SPACE'
    - handles user key input event listening
    - binds user input into defined actions (ex: LEFT_ARROW = move_left)

- Mouse
    - handle mouse interaction with specific tiles


#### ROT.js dependent features

- LightingROT
    - manages position of lights
    - calculates illumination of map tiles

- FovROT
    - calculates fov but can be limited to 90 or 180 degree field of view from a given direction


## Goals

### User Requirements

- basic js skill level

### Code

- simple and easy to follow
- well commented and documented
- demonstrates good practices
- object oriented design
- minimal dependencies (ideally none).
- core code produces a single global variable `RL`

- **Avoided non-begginer techniques**
    - game loop / animation
    - object inheritance
    - build process
    - inaccessable or un-modifiable code or behavior (getters, setters, private-ish varables etc)