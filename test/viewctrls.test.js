describe('viewctrls', function () {
    var vc;

    before(function() {
    // beforeEach(function() {
        vc = $('#vc');
    });

    function destroyVc() {
        if(vc.data().hasOwnProperty('moc-viewctrls')) {
            vc.viewctrls('destroy');
        }
    }

    //////////////////
    // the 2 following tests don't work together - the thrown error seems to
    // stop all following tests from running (error not being caught?)
    //////////////////
    describe('initializing widget with bad controls', function () {
        afterEach(function() {
            destroyVc();
        });

        it('should throw an error if controls is not an object', function() {
            var wrongTypeInit = function() {
                vc.viewctrls({ controls: [] });
            };
            expect(wrongTypeInit.bind(vc)).to.throw(TypeError);
        });
    // });
    // describe('initializing widget without controls', function () {
        it('should throw an error if no controls are passed', function(done) {
            var initNoCtrls = function() { vc.viewctrls(); };
            expect(initNoCtrls.bind(vc)).to.throw(Error);
            done();
        });
    });

    describe('vc elem after throw tests', function () {
        it('should not have plugin class', function() {
            expect(vc.hasClass('viewctrls')).to.be.false;
        });
    });

    describe('vc elem after destroyed', function () {
        before(function() {
            vc.viewctrls(getInitObj());
            destroyVc();
        });
        
        it('should not have any children', function () {
            expect(vc.children().length).to.equal(0);
        });
    });

    describe('initialized widget', function() {
        beforeEach(function() {
            vc.viewctrls(getInitObj());
        });
        afterEach(function() {
            destroyVc();
        });

        it('should have widget-specific class', function() {
            expect(vc.hasClass('viewctrls')).to.be.true;
        });
        it('should have at least one object in options.controls', function() {
            var inst = vc.data('moc-viewctrls');
            var hasProps = false;
            var controls = inst.options.controls;

            expect(controls).to.be.ok;
            for(var key in controls) {
                if(controls[key]) {
                    hasProps = true;
                    break;
                }
            }
            expect(hasProps).to.be.true;
        });
        it('should have control(s) with at least a "func" callback', function() {
            var controls = vc.data('moc-viewctrls').options.controls;

            for(cmd in controls) {
                expect(controls[cmd].func).not.to.be.undefined;
            }
        });
    });

    describe('elements', function () {
        // beforeEach(function() {
        // });

        it('should be wrapped by .viewctrls_wrapper', function () {
            vc.viewctrls(getInitObj());
            var wrapper = vc.children('.viewctrls_wrapper');
            assert.isAbove(wrapper.length, 0, 'wrapper does not exist in selection');
        });
        it('should be visible', function() {
            vc.viewctrls(getInitObj());
            var firstCtrl = vc.find('.viewctrl').get(0);
            expect(firstCtrl).to.exist;
            expect($(firstCtrl).is(':visible')).to.be.true;
        });
        it('should add a special class (e.g. "proper-case") when flag is set', function() {
            var properCaseClass = 'proper-case';
            destroyVc();
            var initObj = getInitObj();
            initObj.capitalizeLabels = true;
            vc.viewctrls(initObj);
            firstCtrl = getFirstCtrl();

            expect($(firstCtrl).hasClass(properCaseClass)).to.be.true;
        });
        it('should set attribute for displaying the control label', function() {
            destroyVc();
            var initObj = getInitObj();
            var testLabel = 'Edit that shizzle';
            initObj.controls.Edit.label = testLabel;
            vc.viewctrls(initObj);
            firstCtrl = getFirstCtrl();

            expect($(firstCtrl).data('label')).to.equal(testLabel);
        });
        it('should have icon class when passed', function() {
            destroyVc();
            var iconName = 'icon-edit';
            var initObj = getInitObj();
            initObj.controls.Edit.icon = iconName;
            vc.viewctrls(initObj);

            var firstCtrl = vc.find('.viewctrl');
            var icon = firstCtrl.first().children();
            expect(icon.hasClass(iconName)).to.be.true;
        });
        it('should have icon element as was passed', function() {
            destroyVc();
            var initObj = getInitObj();
            var el = $('<i>', {'data-icon':'fake-icon'});
            initObj.controls.Edit.icon = el;
            vc.viewctrls(initObj);

            var firstCtrl = vc.find('.viewctrl');
            var icon = firstCtrl.first().children();
            // test features of passed element to find match (i.e. didn't just use plugin's span)
            expect($(icon).data('icon')).to.equal('fake-icon');
        });
        it('should throw an error if passed icon is not string or DOM element', function(done) {
            destroyVc();
            var initObj = getInitObj();
            initObj.controls.Edit.icon = [1];
            var badIconErr = function() { vc.viewctrls(initObj) };
            expect(badIconErr).to.throw(TypeError);
            done();
        });
    });

    describe('DOM events', function () {
        beforeEach(function() {
            destroyVc();
        });
        it('should run basic function', function() {
            // destroyVc();
            var initObj = getInitObj();
            var foo;
            var fooVal = 'bar';
            initObj.controls.Edit.func = function(elem) { foo = fooVal; };
            vc.viewctrls(initObj);

            var firstCtrl = vc.find('.viewctrl').first();
            firstCtrl.click(); // should add class
            expect(foo).to.equal(fooVal);
        });
        it('should set data-foo on clicked element using foo property (baz)', function() {
            var initObj = getInitObj();
            var fooVal = 'bar';
            var obj = {
                foo: 'baz',
                setFoo: function(elem) { 
                    elem.attr('data-foo', this.foo);
                }
            };
            initObj.controls.Edit.func = obj.setFoo;
            initObj.controls.Edit.thisArg = obj;
            vc.viewctrls(initObj);
            var firstCtrl = vc.find('.viewctrl').first();
            firstCtrl.click();

            expect(firstCtrl.data('foo')).to.equal(obj.foo);
        });
        it('should use passed argument in callback function (data-foo = fooArg)', function () {
            var initObj = getInitObj();
            var argFoo = 'bar';
            initObj.controls.Edit.func = function(elem, foo) {
                elem.attr('data-foo', foo);
            };
            initObj.controls.Edit.args = [argFoo];
            vc.viewctrls(initObj);
            var firstCtrl = getFirstCtrl();
            firstCtrl.click();

            expect(firstCtrl.data('foo')).to.equal(argFoo);
        });
    });

    /**
     * Used so that tests that should pass have same conf
     * (and if I screw smthg up, it catches it)
     * @return {object} viewctrls init object (options)
     */
    function getInitObj() {
        return {
            controls: {
                'Edit': {
                    func: function() {}
                }
            }
        };
    }
    function getFirstCtrl() {
        return vc.find('.viewctrl').first();
    }
});