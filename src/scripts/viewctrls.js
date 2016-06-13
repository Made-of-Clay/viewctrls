////////////////////////////////////////////
/////////////// USING BABEL ////////////////
////////////////////////////////////////////
/**
 * viewctrls plugin adds small button-like elements (controls) to the element initializing the plugin
 * The controls are defined using the "controls" option
 * @example - a Refresh control that refreshes the page in 5 seconds
    elem.viewctrls({
        controls: {
            Refresh: {
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

        /**
         * @memberOf viewctrls
         */
        _addWrapper: _addWrapper,
        _buildCtrls: _buildCtrls,
        _checkOptions: _checkOptions,
        _create: _create,
        _destroy: _destroy
    };

    function _create() {
        this.element.addClass('viewctrls');
        this._checkOptions();
    }
    /**
     * @method
     */
    function _checkOptions() {
        if(checkControlsType(this.options.controls)) {
            this._buildCtrls();
        }
    }
    /**
     * @internal
     */
    function checkControlsType(controls) {
        if($.isPlainObject(controls)) {
            let errMsg = 'At least one control must be passed to viewctrls()';
            if(objIsEmpty(controls)) throw new ReferenceError(errMsg);

            return true;
        } else {
            let errMsg = 'The controls option must be an object with at least one control inside';
            throw new TypeError(errMsg);
        }
    }
    /**
     * @internal
     */
    function objIsEmpty(obj) {
        var isEmpty = true;
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                isEmpty = false;
                break;
            }
        }
        return isEmpty;
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

        for(let key in plugin.options.controls) {
            let control = plugin.options.controls[key];
            let capClass = capLabels ? 'proper-case' : '';
            let ctrlClass = (isString(custCtrlClass) && !isEmpty(custCtrlClass)) ? custCtrlClass : '';
            let label = labelCheck(key, control);
            var ctrl = $('<span>', {
                class: `viewctrl ${capClass} ${ctrlClass}`,
                // title: key
                'data-label': label
            });

            var iconEl = checkIcon(control.icon);
            if(iconEl !== null) {
                ctrl.append(iconEl);
            }
            addListener(ctrl, control);
            $btns = $btns.add(ctrl);
        }
        wrapper.append($btns);
    }
    /**
     * @method
     */
    function _addWrapper() {
        var wrapClass = buildWrapClasses('viewctrls-wrapper', this.options.wrapperClass);
        var wrapper = $('<div>', { class:wrapClass });
        this.element.append(wrapper);
        return wrapper;
    }
    /**
     * @internal
     */
    function buildWrapClasses(base, opts) {
        var strClass = base;
        if(isString(opts)) {
            strClass += ' ' + opts;
        }
        return strClass;
    }
    /**
     * @internal
     */
    function labelCheck(key, opts) {
        if(!isEmpty(opts.label)) {
            if(isString(opts.label)) {
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
    function checkIcon(icon) {
        var elem = null;
        if(!isEmpty(icon)) {
            icon = (icon instanceof jQuery) ? icon.get(0) : icon;
            var iconClass = 'viewctrl-icon';

            if(isString(icon)) {
                elem = $('<span>', { class:`${icon} ${iconClass}` });
            } else if(isObject(icon) && isDomEl(icon)) {
                elem = $(icon).addClass(iconClass);
            } else {
                let typeErrMsg = `That icon passed must either be a string (class name) or DOM element: passed type was "${typeof icon}"`;
                throw new TypeError(typeErrMsg);
            }
        }
        return elem;
    }
    /**
     * @internal
     */
    function addListener(elem, opts) {
        var thisArg = !isEmpty(opts.thisArg) ? opts.thisArg : window;
        var baseArg = [elem];
        var args = !isEmpty(opts.args) ? baseArg.concat(opts.args) : baseArg;

        $(elem).click(function viewctrlClkd() {
            opts.func.apply(thisArg, args);
        });
    }

    function _destroy() {
        this.element
            .removeClass('viewctrls')
            .html('')
        ;
    }

    $.widget('moc.viewctrls', vcwidget);

    // Utility Functions
    function isString(toCheck) {
        return typeof toCheck === 'string';
    }
    function isDomEl(toCheck) {
        return parseInt(toCheck.nodeType) === 1;
    }
    function isObject(toCheck) {
        return typeof toCheck === 'object';
    }
    function isEmpty(mixed_var) {
        var undef, key, i, len;
        var emptyValues = [undef, null, false, 0, '', '0'];

        for (i = 0, len = emptyValues.length; i < len; i++) {
            if (mixed_var === emptyValues[i]) {
                return true;
            }
        }

        if (typeof mixed_var === 'object') {
            for (key in mixed_var) {
                return false;
            }
            return true;
        }

        return false;
    }
})(jQuery);