describe('viewctrls', function () {
    var vc;

    before(function() {
    // beforeEach(function() {
        vc = $('#vc');
    });
    afterEach(function() {
        if(vc.data().hasOwnProperty('moc-viewctrls')) {
            vc.viewctrls('destroy');
        }
    });

    //////////////////
    // the 2 following tests don't work together - the thrown error seems to
    // stop all following tests from running (error not being caught?)
    //////////////////
    describe('initializing widget with bad controls', function () {
        it('should throw an error if controls is not an object', function() {
            var wrongTypeInit = function() {
                vc.viewctrls({ controls: [] });
            };
            expect(wrongTypeInit.bind(vc)).to.throw(TypeError);
        });
    });

    describe('initializing widget without controls', function () {
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

    describe('initialized widget', function() {
        beforeEach(function() {
            vc.viewctrls({
                controls: {
                    'Edit': {
                        func: function() {}
                    }
                }
            });
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

//     describe('elements', function () {
//         beforeEach(function() {
//             vc.viewctrls({
//                 controls: {
//                     'Edit': {
//                         func: function() {}
//                     }
//                 }
//             });
//         });

//         it('should be wrapped by .viewctrls_wrapper', function () {
// // console.log('vc',vc);
//             var wrapper = vc.children('.viewctrls_wrapper');
//             assert.isAbove(wrapper.length, 0, 'wrapper does not exist in selection');
//         })
//         // it('should be wrapper and visible', function() {
//         //     var firstCtrl = vc.find('.viewctrl').get(0);
//         //     assert.isAbove(firstCtrl.length, 0, 'first viewctrl does not exist in selection');
//         //     expect(firstCtrl.is(':visible')).to.be.true;
//         // });
//     });

    describe('vc elem after destroyed', function () {
        it('should not have any children', function () {
            expect(vc.children().length).to.equal(0);
        });
    });

    // describe('DOM events', function () {
    //     it('should do stuff');
    // });
});