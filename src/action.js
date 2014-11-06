(function(root) {
    'use strict';

    /**
     * A performable action implementation.
     * Handles the resolution of a source object performing an action on a target object.
     * Performable action logic is attached to and primarily related to the source.
     * Methods on this object should only be called by the {{#crossLink "PerformableActionInterface"}}
     *
     * If any of the functions on this object should always return `true` or `false`
     *   it can be set to a `Boolean` value that will be used
     *   instead of the value returned by calling the function.
     *
     * @class PerformableAction
     * @static
     */
    var PerformableAction = {

        /**
         * Checks if the entity with this `PerformableAction` can currently perform the action.
         * Instead of a function `this.canPerformAction` can be set to a boolean value if the check should always be true or false.
         *
         * If this functions should always return `true` or `false` it can be set to a `Boolean` value that will be used
         * instead of the value returned by calling the function.
         *
         * @method canPerformAction
         * @param {Object} settings - The settings for the action.
         * @return {Bool}
         */
        canPerformAction: true,

        /**
         * Checks if the entity with this `PerformableAction` can currently perform the action on given target.
         *
         * If this functions should always return `true` or `false` it can be set to a `Boolean` value that will be used
         * instead of the value returned by calling the function.
         *
         * @method canPerformActionOnTarget
         * @param {Object} target - The target to perform the action on.
         * @param {Object} settings - The settings for the action.
         * @return {Bool}
         */
        canPerformActionOnTarget: true,

        /**
         * Performs this `PerformableAction` from source on target using settings.
         *
         * If this functions should always return `true` or `false` it can be set to a `Boolean` value that will be used
         * instead of the value returned by calling the function.
         *
         * @method performAction
         * @param {Object} target - The target to perform the action on.
         * @param {Object} settings - The settings for the action.
         * @return {Bool}
         */
        performAction: true,

        /**
         * Returns a list of valid targets to perform this action on.
         * @method getTargetsForAction
         * @param {Object} [settings] - Settings for the action.
         * @return {Array} Array of valid targets.
         */
        getTargetsForAction: false,

        /**
         * Optional function called after action is resolved successfully.
         * @method afterPerformActionSuccess
         * @param {Object} target - The target to perform the action on.
         * @param {Object} [settings] - Settings for the action.
         * @return {Array} Array of valid targets.
         */
        afterPerformActionSuccess: null,

        /**
         * Optional function called after action is resolved un-successfully.
         * @method afterPerformActionSuccess
         * @param {Object} target - The target to perform the action on.
         * @param {Object} [settings] - Settings for the action.
         * @return {Array} Array of valid targets.
         */
        afterPerformActionFailure: null,
    };

    /**
     * A resolvable action implementation.
     * Handles the resolution of a source object performing an action on a target object.
     * Resolvable action logic is attached to and primarily related to the target.
     * Methods on this object should only be called by the {{#crossLink "ResolvableActionInterface"}}{{/crosslink}}
     *
     * If any of the functions on this object should always return `true` or `false`
     *   it can be set to a `Boolean` value that will be used
     *   instead of the value returned by calling the function.
     *
     * @class ResolvableAction
     * @static
     */
    var ResolvableAction = {

        /**
         * Checks if the entity with this `ResolvableAction` can currently resolve the action given source and settings.
         * Instead of a function `this.canPerformAction` can be set to a boolean value if the check should always be true or false.
         *
         * If this functions should always return `true` or `false` it can be set to a `Boolean` value that will be used
         * instead of the value returned by calling the function.
         *
         * @method canResolveAction
         * @param {String} action - The action being performed on this target to resolve.
         * @param {Object} source - The source object performing the action on this target.
         * @param {Object} [settings] - Settings for the action.
         * @return {Bool}
         */
        canResolveAction: true,

        /**
         * Resolves an action on target from source with given settings.
         * @method resolveAction
         * @param {String} action - The action being performed on this target to resolve.
         * @param {Object} source - The source object performing the action on this target.
         * @param {Object} [settings] - Settings for the action.
         * @return {Boolean} `true` if the action was successfully resolved.
         */
        resolveAction: true,
    };

    root.RL.PerformableAction = PerformableAction;
    root.RL.ResolvableAction = ResolvableAction;

}(this));
