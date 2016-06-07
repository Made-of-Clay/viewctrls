describe('jQuery', function () {
    it('should be present', function() {
        expect(jQuery).to.be.ok;
    });
    it('should have widget factory', function() {
        expect(jQuery.widget).to.be.ok;
    });
});