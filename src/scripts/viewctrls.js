(function addToWidgetFactory($) {
    // widget goes in here
    // define object
    // init widget at bottom
    var vcwidget = {
        options: {
            controls: {}
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
        if($.isPlainObject(this.options.controls)) {
            let errMsg = 'At least one control must be passed to viewctrls()';
            if(objIsEmpty(this.options.controls)) throw new ReferenceError(errMsg);
            // if(objIsEmpty(this.options.controls)) console.warn('The controls object was not passed to .viewctrls()');

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
        this._addWrapper();
        // for(let key in this.options.controls) {
        //     let control = this.options.controls[key];


        // }
    }
    function _addWrapper() {
        var wrapper = $('<div>', { class:'viewctrls_wrapper' });
        this.element.append(wrapper);
    }

    function _destroy() {
        this.element
            .removeClass('viewctrls')
            .html('')
        ;
    }

    $.widget('moc.viewctrls', vcwidget);
})(jQuery);