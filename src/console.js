(function(root) {
    'use strict';

    /**
    * Manages the display and history of console messages to the user.
    * "The troll hits you dealing 10 damage."
    * "You die."
    * @class Console
    * @constructor
    * @param {Game} game - Game instance this obj is attached to.
    * @param {Number} [messageHistoryCount=5] - Number of messages to display at once.
    * @param {String} [elClassName='console'] - Css class name to assign to the console element.
    */
    var Console = function Console(game, messageHistoryCount, elClassName) {
        this.el = document.createElement('div');
        this.el.className = elClassName || 'console';
        this.messageHistoryCount = messageHistoryCount || 5;
        this.game = game;
    };

    Console.prototype = {
        constructor: Console,

        /**
        * Game instance this obj is attached to.
        * @property game
        * @type Game
        */
        game: null,

        /**
        * Element containing console messages.
        * Must be manually added to the DOM
        * @property el
        * @type HTMLElement
        */
        el: null,

        /**
        * Number of messages to display at once.
        * @property messageHistoryCount
        * @type Number
        */
        messageHistoryCount: 5,

        /**
        * Adds a message to the console.
        * @method log
        * @param {String} - Message to be added.
        */
        log: function(message){
            if(this.el.children.length > this.messageHistoryCount - 1){
                var childEl = this.el.childNodes[0];
                childEl.remove();
            }

            var messageEl = document.createElement('div');
            messageEl.innerHTML = message;
            this.el.appendChild(messageEl);

        },
    };

    root.RL.Console = Console;

}(this));