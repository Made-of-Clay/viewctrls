describe('viewctrls', function () {
    var vc;

    before(function() {
        vc = $('#vc');
    });

    function destroyVc() {
        if(vc.data().hasOwnProperty('moc-viewctrls')) {
            vc.viewctrls('destroy');
        }
    }

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
        it('should throw an error if no controls are passed', function(done) {
            var initNoCtrls = function() { vc.viewctrls(); };
            expect(initNoCtrls.bind(vc)).to.throw(Error);
            done();
        });
        it('should throw an error if no func property (or alias) is passed with control', function(done) {
            var noFuncInit = function() {
                vc.viewctrls({
                    controls: {
                        link: {}
                    }
                });
            };
            expect(noFuncInit.bind(vc)).to.throw(ReferenceError);
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
        it('should add custom wrapper class when passed', function() {
            destroyVc();
            var initObj = getInitObj();
            var custClass = 'some_WRapper foo';
            initObj.wrapperClass = custClass;
            vc.viewctrls(initObj);
            expect(vc.find('.viewctrls-wrapper').hasClass(custClass)).to.be.true;
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
    });

    describe('elements', function () {
        var initObj;

        beforeEach(function() {
            destroyVc();
            initObj = getInitObj();
        });

        it('should be wrapped by .viewctrls-wrapper', function () {
            vc.viewctrls(initObj);
            var wrapper = vc.children('.viewctrls-wrapper');
            assert.isAbove(wrapper.length, 0, 'wrapper does not exist in selection');
        });
        it('should be visible', function() {
            vc.viewctrls(initObj);
            var firstCtrl = vc.find('.viewctrl').get(0);
            expect(firstCtrl).to.exist;
            expect($(firstCtrl).is(':visible')).to.be.true;
        });
        it('should have an attribute containing the control init key', function() {
            vc.viewctrls(initObj);
            firstCtrl = getFirstCtrl();

            expect(firstCtrl.data('key')).to.equal('edit');
        });
        it('should add a special class (e.g. "proper-case") when flag is set', function() {
            var properCaseClass = 'proper-case';
            initObj.capitalizeLabels = true;
            vc.viewctrls(initObj);
            firstCtrl = getFirstCtrl();

            expect($(firstCtrl).hasClass(properCaseClass)).to.be.true;
        });
        it('should all have custom class when specified', function() {
            var custCtrlClass = 'amazo-btn';
            initObj.controlClass = custCtrlClass;
            initObj.controls.adam = { func:$.noop };
            vc.viewctrls(initObj);
            var allHaveClass = true;

            vc.find('.viewctrl').each(function(inx, elem) {
                if(!$(elem).hasClass(custCtrlClass)) {
                    allHaveClass = false;
                }
            });

            expect(allHaveClass).to.be.true;
        })
        it('should set attribute for displaying the control label', function() {
            var testLabel = 'edit that shizzle';
            initObj.controls.edit.label = testLabel;
            vc.viewctrls(initObj);
            firstCtrl = getFirstCtrl();

            expect($(firstCtrl).data('label')).to.equal(testLabel);
        });
        it('should have icon class when passed', function() {
            var iconName = 'icon-edit';
            initObj.controls.edit.icon = iconName;
            vc.viewctrls(initObj);

            var firstCtrl = vc.find('.viewctrl');
            var icon = firstCtrl.first().children();
            expect(icon.hasClass(iconName)).to.be.true;
        });
        it('should have icon element as was passed', function() {
            var el = $('<i>', {'data-icon':'fake-icon'});
            initObj.controls.edit.icon = el;
            vc.viewctrls(initObj);

            var firstCtrl = vc.find('.viewctrl');
            var icon = firstCtrl.first().children();
            expect($(icon).data('icon')).to.equal('fake-icon');
        });
        it('should throw an error if passed icon is not string or DOM element', function(done) {
            initObj.controls.edit.icon = [1];
            var badIconErr = function() { vc.viewctrls(initObj) };
            expect(badIconErr).to.throw(TypeError);
            done();
        });
        it('should accept specified element tag name', function() {
            var custTag = 'strong';
            initObj.controls.edit.tag = custTag;
            vc.viewctrls(initObj);
            var firstCtrl = getFirstCtrl();

            expect(firstCtrl[0].nodeName.toLowerCase()).to.equal(custTag);
        });
        it('should add specified attributes & preserve "class" attribute value', function() {
            var custAttr = 'data-foo';
            var custAttrVal = 'bar';
            var custClass = 'adaman';
            var attr = { class:custClass };
            attr[custAttr] = custAttrVal;
            initObj.controls.edit.attr = attr;
            vc.viewctrls(initObj);
            var firstCtrl = getFirstCtrl();

            expect(firstCtrl.is('['+custAttr+']')).to.be.true;
            expect(firstCtrl.attr(custAttr)).to.equal(custAttrVal);
            expect(firstCtrl.hasClass(custClass)).to.be.true;
            expect(firstCtrl.hasClass('viewctrl')).to.be.true;
        });
        it('should append controls if container is already initialized', function () {
            var reinit = $('<div>').appendTo(document.body);
            reinit.viewctrls(initObj);
            var newInitObj = {
                controls: {
                    'refresh': {
                        func: function() {}
                    }
                }
            };

            reinit.viewctrls(newInitObj);

            expect(reinit.find('.viewctrl:eq(0)').data('key')).to.equal('edit');
            expect(reinit.find('.viewctrl:eq(1)').data('key')).to.equal('refresh');
        });
    });

    describe('DOM events', function () {
        var initObj;
        beforeEach(function() {
            destroyVc();
            initObj = getInitObj();
        });
        it('should run basic function', function() {
            var foo;
            var fooVal = 'bar';
            initObj.controls.edit.func = function(elem) { foo = fooVal; };
            vc.viewctrls(initObj);

            var firstCtrl = vc.find('.viewctrl').first();
            firstCtrl.click(); // should add class
            expect(foo).to.equal(fooVal);
        });
        it('should return click event object', function () {
            var fooVal = 'bar';
            initObj.controls.edit.func = function(event) {
                if(event.hasOwnProperty('target')) {
                    $(event.target).attr('data-foo', fooVal);
                }
            }
            vc.viewctrls(initObj);
            var firstCtrl = vc.find('.viewctrl').first();
            firstCtrl.click(); // should add class
            expect(firstCtrl.data('foo')).to.equal(fooVal);
        })
        it('should set data-foo on clicked element using foo property (baz)', function() {
            var fooVal = 'bar';
            var obj = {
                foo: 'baz',
                setFoo: function(evt) { 
                    var elem = $(evt.target);
                    elem.attr('data-foo', this.foo);
                }
            };
            initObj.controls.edit.func = obj.setFoo;
            initObj.controls.edit.thisArg = obj;
            vc.viewctrls(initObj);
            var firstCtrl = vc.find('.viewctrl').first();
            firstCtrl.click();

            expect(firstCtrl.data('foo')).to.equal(obj.foo);
        });
        it('should use passed argument in callback function (data-foo = fooArg)', function () {
            var argFoo = 'bar';
            initObj.controls.edit.func = function(evt, foo) {
                var elem = $(evt.target);
                elem.attr('data-foo', foo);
            };
            initObj.controls.edit.args = [argFoo];
            vc.viewctrls(initObj);
            var firstCtrl = getFirstCtrl();
            firstCtrl.click();

            expect(firstCtrl.data('foo')).to.equal(argFoo);
        });
        it('should accept the "callback" alias to "func"', function() {
            var fooVal = 'bar';
            initObj.controls.edit.func = null;
            initObj.controls.edit.callback = function(evt) {
                var elem = $(evt.target);
                elem.attr('data-foo', fooVal);
            };
            vc.viewctrls(initObj);
            var firstCtrl = getFirstCtrl();
            firstCtrl.click();

            expect(firstCtrl.data('foo')).to.equal(fooVal);
        });
        it('should accept the "fn" alias to "func"', function() {
            var fooVal = 'bar';
            initObj.controls.edit.func = null;
            initObj.controls.edit.fn = function(evt) {
                var elem = $(evt.target);
                elem.attr('data-foo', fooVal);
            };
            vc.viewctrls(initObj);
            var firstCtrl = getFirstCtrl();
            firstCtrl.click();

            expect(firstCtrl.data('foo')).to.equal(fooVal);
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
                'edit': {
                    func: function() {}
                }
            }
        };
    }
    function getFirstCtrl() {
        return vc.find('.viewctrl').first();
    }
});