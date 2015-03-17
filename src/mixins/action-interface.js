(function(root) {
    'use strict';

    /**
     * Surface API to handle {{#crossLink "PerformableAction"}}{{/crossLink}} implementations.
     * This allows a source object and target object to have separate action resolution logic without directly referencing eachother.
     * See also {{#crossLink "ResolvableActionInterface"}}{{/crossLink}}, {{#crossLink "ResolvableAction"}}{{/crossLink}}
     * @class PerformableActionInterface
     * @static
     */
    var PerformableActionInterface = {

        /**
         * Sets a performable action implementation on object.
         * @method setPerformableAction
         * @param {String} action - The action name.
         * @param {PerformableAction} implementation - Object to set as the action implementation.
         *   or a string to lookup an implementation `RL.PerformableActions[implementation]`.
         */
        setPerformableAction: function(action, implementation){
            this.performableActions                     = this.performableActions                        || {};
            this.performableActions[action]             = this.performableActions[action]                || {};
            this.performableActions[action].actionName  = this.performableActions[action].actionName     || action;

            implementation = implementation || RL.PerformableAction.Types[action];

            this.performableActions[action] = Object.create(implementation);
            // merge could be used instead of Object.create but is less desirable
            // RL.Util.merge(this.performableAction.Types[action], implementation);

            if(this.performableActions[action].init){
                this.performableActions[action].init.call(this);
            }
        },

        /**
         * Returns a list of valid targets to perform an action on.
         * @method getTargetsForAction
         * @param {String} action - The action to get targets for.
         * @param {Object} [settings] - Settings for the action.
         * @return {Array} Array of valid targets.
         */
        getTargetsForAction: function(action, settings){
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }

            if(!handler.getTargetsForAction){
                return false;
            }

            settings = settings || {};
            if(!settings.skipCanPerformAction && !this.canPerformAction(action, settings)){
                return false;
            }

            return handler.getTargetsForAction.call(this, settings);
        },

        /**
         * Checks if source can perform an action with given settings. (source is `this`)
         * Functionality separated to avoid checking multiple targets when source cannot perform action regardless of target.
         * @method canPerformAction
         * @param {string} action - The action to check.
         * @param {Object} [settings] - Settings for the action.
         * @return {Boolean} `true` if the action can be performed.
         */
        canPerformAction: function(action, settings){
            if(!this.performableActions){
                return false;
            }
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }
            if(handler.canPerformAction === false){
                return false;
            }

            if(!(handler.canPerformAction === true || handler.canPerformAction.call(this, settings))){
                return false;
            }
            return true;
        },

        /**
         * Checks if source can perform an action on target with given settings.
         * @method canPerformActionOnTarget
         * @param {string} action - The action to check.
         * @param {Object} target - The target object to check against.
         * @param {Object} [settings] - Settings for the action.
         * @param {Object} [settings.skipCanPerformAction] - If true skips checking that `this.canPerformAction(action, settings) == true`
         * @return {Boolean} `true` if the action can be performed on target.
         */
        canPerformActionOnTarget: function(action, target, settings){
            if(!this.performableActions){
                return false;
            }
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }
            // target cannot resolve any actions
            if(!target.canResolveAction){
                return false;
            }

            settings = settings || {};
            if(!settings.skipCanPerformAction && !this.canPerformAction(action, settings)){
                return false;
            }

            if(!(handler.canPerformActionOnTarget === true || handler.canPerformActionOnTarget.call(this, target, settings))){
                return false;
            }
            return target.canResolveAction(action, this, settings);
        },

        /**
         * Performs an action on target with given settings.
         * @method performAction
         * @param {String} action - The action to perform.
         * @param {Object} target - The target object to perform the action on.
         * @param {Object} [settings] - Settings for the action.
         * @param {Object} [settings.skipCanPerformAction] - If true skips checking that `this.canPerformAction(action, settings) == true`
         * @param {Object} [settings.skipCanPerformActionOnTarget] - If true skips checking that `this.skipCanPerformActionOnTarget(action, target, settings) == true`
         * @return {Boolean} `true` if the action has been successfully completed.
         */
        performAction: function(action, target, settings){
            if(!this.performableActions){
                return false;
            }
            var handler = this.performableActions[action];
            if(!handler){
                return false;
            }

            settings = settings || {};
            // the functions are in this order because `this.canPerformActionOnTarget` will check `this.canPerformAction`
            // unless flaged to be skipped.
            if(!settings.skipCanPerformActionOnTarget && !this.canPerformActionOnTarget(action, target, settings)){
                return false;
            } else if(!settings.skipCanPerformAction && !this.canPerformAction(action, settings)){
                return false;
            }

            var result;
            if(handler.performAction === true){
                result = {};
            } else {
                result = handler.performAction.call(this, target, settings);
            }

            if(result === false){
                return false;
            }
            settings.result = result;
            var outcome = target.resolveAction(action, this, settings);
            if(outcome && handler.afterPerformActionSuccess){
                handler.afterPerformActionSuccess.call(this, target, settings);
            } else if(!outcome && handler.afterPerformActionFailure){
                handler.afterPerformActionFailure.call(this, target, settings);
            }
            return outcome;
        },
    };

    /**
     * Surface API to handle {{#crossLink "ResolvableAction"}}{{/crossLink}} implementations.
     * This allows a source object and target object to have separate action resolution logic without directly referencing eachother.
     * See also {{#crossLink "PerformableActionInterface"}}{{/crossLink}}, {{#crossLink "PerformableAction"}}{{/crossLink}}
     * @class ResolvableActionInterface
     * @static
     */
    var ResolvableActionInterface = {

        /**
         * Sets a resolvable action implementation on object.
         * @method setResolvableAction
         * @param {String} action - The action name.
         * @param {ResolvableAction} [implementation] - Object to set as the action implementation.
         */
        setResolvableAction: function(action, implementation){
            this.resolvableActions                      = this.resolvableActions                        || {};
            this.resolvableActions[action]              = this.resolvableActions[action]                || {};
            this.resolvableActions[action].actionName   = this.resolvableActions[action].actionName     || action;

            implementation = implementation || RL.ResolvableAction.Types[action];
            this.resolvableActions[action] = Object.create(implementation);
            // merge could be used instead of Object.create but is less desirable
            // RL.Util.merge(this.resolvableAction.Types[action], implementation);

            if(this.resolvableActions[action].init){
                this.resolvableActions[action].init.call(this);
            }
        },

        /**
         * Checks if a target can resolve an action with given source and settings. `this` is the target.
         * @method canResolveAction
         * @param {String} action - The action being performed on this target to resolve.
         * @param {Object} source - The source object performing the action on this target.
         * @param {Object} [settings] - Settings for the action.
         * @return {Boolean} `true` if action was successfully resolved
         */
        canResolveAction: function(action, source, settings){
            if(!this.resolvableActions){
                return false;
            }
            var handler = this.resolvableActions[action];
            if(!handler){
                return false;
            }
            if(handler.canResolveAction === false){
                return false;
            }
            if(handler.canResolveAction === true){
                return true;
            }
            return handler.canResolveAction.call(this, source, settings);
        },

        /**
         * Resolves an action on target from source with given settings.
         * @method performAction
         * @param {String} action - The action being performed on this target to resolve.
         * @param {Object} source - The source object performing the action on this target.
         * @param {Object} [settings] - Settings for the action.
         * @param {Object} [settings.skipCanResolveAction] - If true skips checking that `this.skipCanResolveAction(action, source, settings) == true`
         * @return {Boolean} `true` if the action was successfully resolved.
         */
        resolveAction: function(action, source, settings){
            if(!this.resolvableActions){
                return false;
            }
            var handler = this.resolvableActions[action];
            if(!handler){
                return false;
            }
            settings = settings || {};
            if(!settings.skipCanResolveAction && !this.canResolveAction(action, source, settings)){
                return false;
            }

            if(handler.resolveAction === false){
                return false;
            }
            if(handler.resolveAction === true){
                return true;
            }
            return handler.resolveAction.call(this, source, settings);
        },
    };

    root.RL.Mixins.PerformableActionInterface = PerformableActionInterface;
    root.RL.Mixins.ResolvableActionInterface = ResolvableActionInterface;

}(this));