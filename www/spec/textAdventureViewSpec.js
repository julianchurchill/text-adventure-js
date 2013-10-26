
var view = {
    onDescriptionChanged: function(newDescription) {
        var el = document.getElementById('description');
        el.text = newDescription;
    },
    onExitsChanged: function(newExits) {
        var el = document.getElementById('exits');
        el.text = "There are no exits visible.";
    }
};

describe('text adventure view', function() {
    it('should update description div when description changed', function() {
        var el = document.getElementById('stage');
        el.innerHTML = '<div id="description"></div>';

        view.onDescriptionChanged( "new description" );

        var d = document.getElementById('description');
        expect(d.text).toEqual('new description');
    });

    describe('exits changed event', function() {
        beforeEach(function() {
            var el = document.getElementById('stage');
            el.innerHTML = '<div id="exits"></div>';
        });

        it('should cause have special exits text when no exits available ', function() {
            view.onExitsChanged();

            var d = document.getElementById('exits');
            expect(d.text).toEqual('There are no exits visible.');
        });

        //it('should cause exits labels to update', function() {
            //view.onExitsChanged( "exit1label"  );

            //var d = document.getElementById('exits');
            //expect(d.text).toEqual('The following exits are available: exit1label');
        //});
    });
});

