(function addToWidgetFactory($) {
    // widget goes in here
    // define object
    // init widget at bottom
    var vcwidget = {
        options: {
            controls: {}
        },

        _buildCtrls: _buildCtrls,
        _checkOptions: _checkOptions,
        _create: _create,
        _destroy: _destroy,

        derp: function() {
            // return false;
            throw new Error('Derp');
        }
    };

    function _create() {
        this.element.addClass('viewctrls');
        this._checkOptions();
    }
    function _checkOptions() {
        if($.isPlainObject(this.options.controls)) {
            let errMsg = 'At least one control must be passed to viewctrls()';
            if(objIsEmpty(this.options.controls)) console.warn('The controls object was not passed to .viewctrls()');

            // do stuff w/ ctls
            this._buildCtrls();
        } else {
            let errMsg = 'The controls option must be an object with at least one control inside';
            throw new TypeError(errMsg);
        }
    }
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
        // body...
    }

    function _destroy() {
        // body...
    }

    $.widget('moc.viewctrls', vcwidget);
})(jQuery);