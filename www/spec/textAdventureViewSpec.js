
var view = {
    onDescriptionChanged: function(newDescription) {
        var el = document.getElementById('description');
        el.text = newDescription;
        console.log('New description: ' + newDescription);
    }
};

describe('text adventure view', function() {
    it('should update description div when description changed', function() {
        var el = document.getElementById('stage');
        el.innerHTML = ['<div id="description">',
                        '</div>'].join('\n');

        view.onDescriptionChanged( "new description" );
        var d = document.getElementById('description');
        expect(d.text).toEqual('new description');
    });
});

