'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

////////////////////////////////////////////
/////////////// USING BABEL ////////////////
////////////////////////////////////////////
/**
 * viewctrls plugin adds small button-like elements (controls) to the element initializing the plugin
 * The controls are defined using the "controls" option
 * @example - a Refresh control that refreshes the page in 5 seconds
    elem.viewctrls({
        controls: {
            refresh: {
                label: 'Refresh in 5s',
                icon: 'icon-refresh', // HTML class name
                func: function(elem, sec) { refreshPage(sec); }, // see func note below
                args: [5] // passed to func
            }
        }
   });
 * options.controls - Properties of a given control object are as follows:
 *   .icon: an HTML class (string) or DOM element to be added as the icon (optional)
 *   .func: callback function or method to run when the control is clicked
 *   .thisArg: passed "this" reference for the "func" function (optional)
 *   .label: alternative text to display onHover of control (optional)
 *   .attr: map of attributes to add to the control; specifying "class" will append the value to existing class attribute, but others overwrite (optional)
 * options.capitalizeLabels - boolean flag specifying whether or not to add class to capitalize the control labels
 * options.controlClass - string (optionally space-separated if multiples) to add to all viewctrl controls
 * options.wrapperClass - string (optionally space-separated if multiples) to add to the wrapper element
 */
(function addToWidgetFactory($) {
    var vcwidget = {
        options: {
            capitalizeLabels: false,
            controls: {},
            controlClass: '',
            wrapperClass: ''
        },
        // funcAliases: ['callback', 'fn'],

        /**
         * @memberOf viewctrls
         */
        _addWrapper: _addWrapper,
        _buildCtrls: _buildCtrls,
        _checkOptions: _checkOptions,
        _create: _create,
        _init: _init,
        _destroy: _destroy
    };

    $.widget('moc.viewctrls', vcwidget);

    function _create() {
        this.controls = {};
        this.element.addClass('viewctrls');
    }

    function _init() {
        this._checkOptions();
    }
    /**
     * @method
     */
    function _checkOptions() {
        var controlsSafe = checkControlsType(this.options.controls);
        var callbackSafe = checkControlCallback(this.options.controls);

        if (controlsSafe && callbackSafe) {
            this._buildCtrls();
        }
    }
    /**
     * @internal
     */
    function checkControlsType(controls) {
        if ($.isPlainObject(controls)) {
            var errMsg = 'At least one control must be passed to viewctrls()';
            if (objIsEmpty(controls)) throw new ReferenceError(errMsg);

            return true;
        } else {
            var _errMsg = 'The controls option must be an object with at least one control inside';
            throw new TypeError(_errMsg);
        }
    }
    /**
     * @internal
     */
    function objIsEmpty(obj) {
        var isEmpty = true;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                isEmpty = false;
                break;
            }
        }
        return isEmpty;
    }
    function checkControlCallback(controls) {
        var funcList = ['func', 'fn', 'callback'];

        var _loop = function _loop(key) {
            var control = controls[key];
            var matchInControl = false;

            funcList.forEach(function (alias) {
                if (control.hasOwnProperty(alias)) {
                    matchInControl = true;
                }
            });

            if (!matchInControl) {
                throw new ReferenceError('No callback was passed with the "' + key + '" object. Pass "func", "fn", or "callback" property in this control object');
            }
        };

        for (var key in controls) {
            _loop(key);
        }
        return true;
    }
    /**
     * @method
     */
    function _buildCtrls() {
        var plugin = this;
        var wrapper = plugin._addWrapper();
        var $btns = $();
        var capLabels = plugin.options.capitalizeLabels;
        var custCtrlClass = plugin.options.controlClass;

        $.extend(true, plugin.controls, plugin.options.controls);

        for (var key in plugin.controls) {
            var _control = plugin.controls[key];
            var capClass = capLabels ? 'proper-case' : '';
            var ctrlClass = isString(custCtrlClass) && !isEmpty(custCtrlClass) ? custCtrlClass : '';
            var label = labelCheck(key, _control);
            var tag = checkTag(_control.tag);
            var custAtts = $.isPlainObject(_control.attr) ? _control.attr : {};
            var defAtts = {
                class: 'viewctrl ' + capClass + ' ' + ctrlClass,
                // title: key
                'data-label': label,
                'data-key': key
            };
            var ctrlAtts = mergeAtts(defAtts, custAtts);
            var ctrl = $('<' + tag + '>', ctrlAtts);

            var iconEl = checkIcon(_control.icon);
            if (iconEl !== null) {
                ctrl.append(iconEl);
            }
            addListener(ctrl, _control);
            $btns = $btns.add(ctrl);
        }
        wrapper.html('').append($btns);
    }
    /**
     * @method
     */
    function _addWrapper() {
        var wrapClass = buildWrapClasses('viewctrls-wrapper', this.options.wrapperClass);
        var wrapper = $('<div>', { class: wrapClass });
        this.element.children('.viewctrls-wrapper').remove();
        this.element.append(wrapper);
        return wrapper;
    }
    /**
     * @internal
     */
    function buildWrapClasses(base, opts) {
        var strClass = base;
        if (isString(opts)) {
            strClass += ' ' + opts;
        }
        return strClass;
    }
    /**
     * @internal
     */
    function labelCheck(key, opts) {
        if (!isEmpty(opts.label)) {
            if (isString(opts.label)) {
                return opts.label;
            } else {
                console.warn('option.label was not a string - defaulting to key');
                return key;
            }
        } else {
            return key;
        }
    }
    /**
     * @internal
     */
    function checkTag(tag) {
        var okayTags = ['div', 'span', 'a', 'b', 'i', 'strong', 'em', 'button'];
        if (!isEmpty(tag)) {
            if ($.inArray(tag, okayTags) > -1) {
                return tag;
            } else {
                console.warn('The tag passed (' + tag + ') was not an acceptable tag. Defaulting to "span". Please choose from the following options: ' + okayTags);
            }
        }
        return 'span'; // default
    }
    /**
     * @internal
     */
    function mergeAtts(def, cust) {
        var newAtts = $.extend({}, def);

        for (var key in cust) {
            if (key === 'class') {
                // append value
                newAtts[key] += ' ' + cust[key];
            } else {
                // append property
                newAtts[key] = cust[key];
            }
        }
        return newAtts;
    }
    /**
     * @internal
     */
    function checkIcon(icon) {
        var elem = null;
        if (!isEmpty(icon)) {
            icon = icon instanceof jQuery ? icon.get(0) : icon;
            var iconClass = 'viewctrl-icon';

            if (isString(icon)) {
                elem = $('<span>', { class: icon + ' ' + iconClass });
            } else if (isObject(icon) && isDomEl(icon)) {
                elem = $(icon).addClass(iconClass);
            } else {
                var typeErrMsg = 'That icon passed must either be a string (class name) or DOM element: passed type was "' + (typeof icon === 'undefined' ? 'undefined' : _typeof(icon)) + '"';
                throw new TypeError(typeErrMsg);
            }
        }
        return elem;
    }
    /**
     * @internal
     */
    function addListener(elem, opts) {
        checkForFunc(opts);

        var thisArg = !isEmpty(opts.thisArg) ? opts.thisArg : window;

        $(elem).click(function viewctrlClkd(event) {
            var baseArg = [event];
            var args = !isEmpty(opts.args) ? baseArg.concat(opts.args) : baseArg;
            opts.func.apply(thisArg, args);
        });
    }
    function checkForFunc(opts) {
        if (opts.hasOwnProperty('func') && $.isFunction(opts.func)) {
            return;
        } else if (opts.hasOwnProperty('callback') && $.isFunction(opts.callback)) {
            opts.func = opts.callback;
        } else if (opts.hasOwnProperty('fn') && $.isFunction(opts.fn)) {
            opts.func = opts.fn;
        }

        ['callback', 'fn'].forEach(function checkFuncAliases(alias) {
            if (opts.hasOwnProperty(alias) && $.isFunction(opts[alias])) {
                opts.func = opts[alias];
            }
        });
    }

    function _destroy() {
        this.element.removeClass('viewctrls').html('');
    }

    // Utility Functions
    function isString(toCheck) {
        return typeof toCheck === 'string';
    }
    function isDomEl(toCheck) {
        return parseInt(toCheck.nodeType) === 1;
    }
    function isObject(toCheck) {
        return (typeof toCheck === 'undefined' ? 'undefined' : _typeof(toCheck)) === 'object';
    }
    function isEmpty(mixed_var) {
        var undef, key, i, len;
        var emptyValues = [undef, null, false, 0, '', '0'];

        for (i = 0, len = emptyValues.length; i < len; i++) {
            if (mixed_var === emptyValues[i]) {
                return true;
            }
        }

        if ((typeof mixed_var === 'undefined' ? 'undefined' : _typeof(mixed_var)) === 'object') {
            for (key in mixed_var) {
                return false;
            }
            return true;
        }

        return false;
    }
})(jQuery);

//# sourceURL=viewctrls.js
