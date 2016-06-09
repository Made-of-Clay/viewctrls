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
        // it('should throw derp error', function (done) {
            // var inst = vc.data('moc-viewctrls');
            // expect(function() {
            //     inst.derp();
            // }).to.throw(Error);
            // // expect(inst.derp()).to.be.false;
            // done();
        // });
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
        })
        it('should be visible', function() {
            vc.viewctrls(getInitObj());
            var firstCtrl = vc.find('.viewctrl').get(0);
            expect(firstCtrl).to.exist;
            expect($(firstCtrl).is(':visible')).to.be.true;
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
    });

    describe('DOM events', function () {
        it('should return foo when clicked'/*, function() {
            destroyVc();
            var initObj = getInitObj();
            initObj.controls.Edit.func = function() { return 'foo'; };
            vc.viewctrls(initObj);

            var firstCtrl = vc.find('.viewctrl');
        }*/);
        it('should return property of parent object context'/*, function() {
            // body...
        }*/);
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
});