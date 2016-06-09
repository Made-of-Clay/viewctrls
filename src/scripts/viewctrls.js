(function addToWidgetFactory($) {
    // widget goes in here
    // define object
    // init widget at bottom
    var vcwidget = {
        options: {
            capitalizeLabels: false,
            controls: {},
            // controls: {
            //    callback: function() {} // or
            //    callback: someMethod,
            //    context: someObject
            // }
        },

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
    function _checkOptions() {
        if(checkControlsType(this.options.controls)) {
            this._buildCtrls();
        }
    }
    /**
     * [checkControlsType description]
     * @param  {[type]} controls [description]
     * @return {[type]}          [description]
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
     * [objIsEmpty description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
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
    function _buildCtrls() {
        var plugin = this;
        var wrapper = plugin._addWrapper();
        var $btns = $();

        for(let key in plugin.options.controls) {
            let control = plugin.options.controls[key];

            // make span w/ class & title
            var ctrl = $('<span>', {
                class: 'viewctrl',
                title: key
            });
            // add icon (if applicable)
            if(control.icon) {
                var iconClass = 'viewctrl-icon';
                var iconEl;
                // string
                if(isString(control.icon)) {
                    iconEl = $('<span>', { class:`${control.icon} ${iconClass}` });
                }
                // // obj/elem
                if(typeof control.icon === 'object') {
                    let icon = control.icon instanceof jQuery ? control.icon.get(0) : control.icon;
                    if(isDomEl(icon)) {
                        iconEl = $(icon).addClass(iconClass);
                    } else {
                        console.warn('The passed icon is not a DOM element node');
                    }
                }
                // if(iconEl === undefined) {
                //     throw new TypeError('That icon passed must either be a string (class name) or DOM element: passed type was ' + typeof control.icon);
                // }
                ctrl.append(iconEl);
            }
            // add click listener
            // add to wrapper
            $btns = $btns.add(ctrl);
        }
        wrapper.append($btns);
    }
    function _addWrapper() {
        var wrapper = $('<div>', { class:'viewctrls_wrapper' });
        this.element.append(wrapper);
        return wrapper;
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
})(jQuery);