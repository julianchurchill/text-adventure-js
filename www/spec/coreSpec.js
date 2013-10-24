
describe('app', function() {
    describe('initialize', function() {
        it('should show description for current location', function() {
            var el = document.getElementById('stage');
            el.innerHTML = ['<div id="description">',
                            '</div>'].join('\n');

            app.onDescriptionChanged( "new description" );
            var d = document.getElementById('description');
            expect(d.text).toEqual('new description');
        });
    });
});

