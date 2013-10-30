(function () {
    "use strict";

    function View() {
    }

    View.prototype.onDescriptionChanged = function(newDescription) {
        var el = document.getElementById('description');
        el.text = newDescription;
    };

    View.prototype.onExitsChanged = function(newExits) {
        var el = document.getElementById('exits');
        if ( newExits.length > 0 ) {
            el.text = "The following exits are available:";
            for( var i = 0 ; i < newExits.length; i++ ) {
                el.text += " " + newExits[i].label;
                if( i !== (newExits.length-1) )
                    el.text += ",";
            }
        } else {
            el.text = "There are no exits visible.";
        }
    };

    View.prototype.onItemsChanged = function(newItems) {
        var el = document.getElementById('items');
        if ( newItems.length > 0 ) {
            el.text = "There";
            if( newItems[0].plural !== undefined && newItems[0].plural === true )
                el.text += " are";
            else
                el.text += " is";
            for( var i = 0 ; i < newItems.length; i++ ) {
                var indefinite_article = " a";
                if( newItems[i].indefinite_article !== undefined )
                    indefinite_article = " " + newItems[i].indefinite_article;
                if( newItems[i].plural !== undefined && newItems[i].plural === true )
                    indefinite_article = " some";
                if( newItems[i].proper_noun !== undefined && newItems[i].proper_noun  === true )
                    indefinite_article = "";
                el.text += indefinite_article + " " + newItems[i].label;
                if( newItems.length > 1 ) {
                    if( i === (newItems.length-2) )
                        el.text += " and";
                    else if( i !== (newItems.length-1) )
                        el.text += ",";
                }
            }
            el.text += " here.";
        } else {
            el.text = "";
        }
    };

    describe('TextAdventureView', function() {
        var view;

        beforeEach(function() {
            view = new View();
        });

        it('should update description div when description changed', function() {
            var el = document.getElementById('stage');
            el.innerHTML = '<div id="description"></div>';

            view.onDescriptionChanged( "new description" );

            var d = document.getElementById('description');
            expect(d.text).toEqual('new description');
        });

        describe('when receiving an exits changed event', function() {
            beforeEach(function() {
                var el = document.getElementById('stage');
                el.innerHTML = '<div id="exits"></div>';
            });

            it('should use special exits text when no exits available ', function() {
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

        describe('when receiving an items changed event', function() {
            beforeEach(function() {
                var el = document.getElementById('stage');
                el.innerHTML = '<div id="items"></div>';
            });

            it('should use blank items text when no items available ', function() {
                view.onItemsChanged( [] );

                var d = document.getElementById('items');
                expect(d.text).toEqual('');
            });

            it('should end item text with here.', function() {
                view.onItemsChanged( [ { label: "label" } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/.* here./);
            });

            it('should use "There is" if first item plurality is not specified', function() {
                view.onItemsChanged( [ { label: "apples" } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/There is .*/);
            });

            it('should use "There is" if first item is not plural', function() {
                view.onItemsChanged( [ { label: "apples", plural: false } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/There is .*/);
            });

            it('should use "There are" if first item is plural', function() {
                view.onItemsChanged( [ { label: "apples", plural: true } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/There are .*/);
            });

            it('should cause item labels to appear in the order they are supplied', function() {
                view.onItemsChanged( [ { label: "label1" },
                                       { label: "label2" },
                                       { label: "label3" } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/.* label1.* label2.* label3 .*/);
            });

            it('should use "a" as the item indefinite article when no other is supplied', function() {
                view.onItemsChanged( [ { label: "apple" } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/.* a apple .*/);
            });

            it('should cause item indefinite article to be used when supplied', function() {
                view.onItemsChanged( [ { label: "apple", indefinite_article: "an" } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/.* an apple .*/);
            });

            it('should override indefinite article with "some" if item is plural', function() {
                view.onItemsChanged( [ { label: "apples", indefinite_article: "an", plural: true } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/.* some apples .*/);
            });

            it('should cause no item indefinite article to be used if item is a proper noun', function() {
                view.onItemsChanged( [ { label: "Apple", indefinite_article: "an", proper_noun: true } ] );

                var d = document.getElementById('items');
                expect(d.text).toMatch(/.* Apple .*/);
                expect(d.text).toNotMatch(/.* an Apple .*/);
            });

        });
    });

}());
