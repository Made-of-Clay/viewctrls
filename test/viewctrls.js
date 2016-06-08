describe('viewctrls', function () {
    var vc;

    before('all tests', function() {
        vc = $('#vc');
    });

    //////////////////
    // the 2 following tests don't work together - the thrown error seems to
    // stop all following tests from running (error not being caught?)
    //////////////////
    describe('initializing widget with bad controls', function () {
        it('should throw an error if controls is not an object', function(done) {
            var wrongTypeInit = function() { vc.viewctrls({ controls: [] }) };
            expect(wrongTypeInit.bind(vc)).to.throw(TypeError);
            done();
        });
    });

    // describe('initializing widget without controls', function () {
    //     it('should throw an error if no controls are passed', function(done) {
    //         var initNoCtrls = function() { vc.viewctrls(); };
    //         expect(initNoCtrls.bind(vc)).to.throw(Error);
    //         done();
    //     });
    // });

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

    describe('DOM elements', function () {
        it('should show stuff');
    });

    describe('DOM events', function () {
        it('should do stuff');
    });
});