
var view = {
    onDescriptionChanged: function(newDescription) {
        var el = document.getElementById('description');
        el.text = newDescription;
    },
    onExitsChanged: function(newExits) {
        var el = document.getElementById('exits');
        if ( newExits.length > 0 ) {
            el.text = "The following exits are available:";
            for( var i in newExits ) {
                el.text += " " + newExits[i].label;
                if( i != (newExits.length-1) )
                    el.text += ",";
            }
        } else {
            el.text = "There are no exits visible.";
        }
    },
    onItemsChanged: function(newItems) {
        var el = document.getElementById('items');
        if ( newItems.length > 0 ) {
            el.text = "There is";
            for( var i in newItems ) {
                el.text += " a " + newItems[i].label;
                if( i != (newItems.length-1) )
                    el.text += " and";
            }
            el.text += " here.";
        } else {
            el.text = "";
        }
    }
};

describe('TextAdventureView', function() {
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
            view.onExitsChanged( [] );

            var d = document.getElementById('exits');
            expect(d.text).toEqual('There are no exits visible.');
        });

        it('should cause exits labels to update', function() {
            view.onExitsChanged( [ { label: "label1" }, { label: "label2" } ] );

            var d = document.getElementById('exits');
            expect(d.text).toEqual('The following exits are available: label1, label2');
        });
    });

    describe('items changed event', function() {
        beforeEach(function() {
            var el = document.getElementById('stage');
            el.innerHTML = '<div id="items"></div>';
        });

        it('should cause special items text when no items available ', function() {
            view.onItemsChanged( [] );

            var d = document.getElementById('items');
            expect(d.text).toEqual('');
        });

        it('should cause item labels to update', function() {
            view.onItemsChanged( [ { label: "label1" }, { label: "label2" } ] );

            var d = document.getElementById('items');
            expect(d.text).toEqual('There is a label1 and a label2 here.');
        });
    });
});

