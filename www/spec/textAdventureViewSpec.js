/*global global, setFixtures*/

(function () {
    "use strict";

    var $ = require('jquery');

    function View() {
    }

    View.prototype.onDescriptionChanged = function(newDescription) {
        $('#description').text(newDescription);
    };

    View.prototype.onExitsChanged = function(newExits) {
        var exits = "";
        if ( newExits.length > 0 ) {
            exits = "The following exits are available:";
            for( var i = 0 ; i < newExits.length; i++ ) {
                exits += " " + newExits[i].label;
                if( i !== (newExits.length-1) )
                    exits += ",";
            }
        } else {
            exits = "There are no exits visible.";
        }
        $('#exits').text(exits);
    };

    View.prototype.onItemsChanged = function(newItems) {
        var items = "";
        if ( newItems.length > 0 ) {
            items = "There";
            if( newItems[0].plural !== undefined && newItems[0].plural === true )
                items += " are";
            else
                items += " is";
            for( var i = 0 ; i < newItems.length; i++ ) {
                var indefinite_article = " a";
                if( newItems[i].indefinite_article !== undefined )
                    indefinite_article = " " + newItems[i].indefinite_article;
                if( newItems[i].plural !== undefined && newItems[i].plural === true )
                    indefinite_article = " some";
                if( newItems[i].proper_noun !== undefined && newItems[i].proper_noun  === true )
                    indefinite_article = "";
                items += indefinite_article + " " + newItems[i].label;
                if( newItems.length > 1 ) {
                    if( i === (newItems.length-2) )
                        items += " and";
                    else if( i !== (newItems.length-1) )
                        items += ",";
                }
            }
            items += " here.";
        } else {
            items = "";
        }
        $('#items').text(items);
    };

    // jasmine-jquery needs a global definition to jQuery like this
    global.jQuery = $;
    var jasmine_jquery = require('jasmine-jquery');

    describe('TextAdventureView', function() {
        var view;
        var description_div, exits_div, items_div;

        beforeEach(function() {
            view = new View();
            setFixtures('<div id="description"></div><div id="exits"></div><div id="items"></div>');
            description_div = $('#description');
            exits_div = $('#exits');
            items_div = $('#items');
        });

        it('should update description div when description changed', function() {
            view.onDescriptionChanged( "new description" );
            expect(description_div.text()).toEqual('new description');
        });

        describe('when receiving an exits changed event', function() {
            it('should use special exits text when no exits available ', function() {
                view.onExitsChanged( [] );
                expect(exits_div.text()).toEqual('There are no exits visible.');
            });

            it('should cause exits labels to update', function() {
                view.onExitsChanged( [ { label: "label1" }, { label: "label2" } ] );
                expect(exits_div.text()).toEqual('The following exits are available: label1, label2');
            });
        });

        describe('when receiving an items changed event', function() {
            it('should use blank items text when no items available ', function() {
                view.onItemsChanged( [] );
                expect(items_div.text()).toEqual('');
            });

            it('should end item text with here.', function() {
                view.onItemsChanged( [ { label: "label" } ] );
                expect(items_div.text()).toMatch(/.* here./);
            });

            it('should use "There is" if first item plurality is not specified', function() {
                view.onItemsChanged( [ { label: "apples" } ] );
                expect(items_div.text()).toMatch(/There is .*/);
            });

            it('should use "There is" if first item is not plural', function() {
                view.onItemsChanged( [ { label: "apples", plural: false } ] );
                expect(items_div.text()).toMatch(/There is .*/);
            });

            it('should use "There are" if first item is plural', function() {
                view.onItemsChanged( [ { label: "apples", plural: true } ] );
                expect(items_div.text()).toMatch(/There are .*/);
            });

            it('should cause item labels to appear in the order they are supplied', function() {
                view.onItemsChanged( [ { label: "label1" },
                                       { label: "label2" },
                                       { label: "label3" } ] );
                expect(items_div.text()).toMatch(/.* label1.* label2.* label3 .*/);
            });

            it('should use "a" as the item indefinite article when no other is supplied', function() {
                view.onItemsChanged( [ { label: "apple" } ] );
                expect(items_div.text()).toMatch(/.* a apple .*/);
            });

            it('should cause item indefinite article to be used when supplied', function() {
                view.onItemsChanged( [ { label: "apple", indefinite_article: "an" } ] );
                expect(items_div.text()).toMatch(/.* an apple .*/);
            });

            it('should override indefinite article with "some" if item is plural', function() {
                view.onItemsChanged( [ { label: "apples", indefinite_article: "an", plural: true } ] );
                expect(items_div.text()).toMatch(/.* some apples .*/);
            });

            it('should cause no item indefinite article to be used if item is a proper noun', function() {
                view.onItemsChanged( [ { label: "Apple", indefinite_article: "an", proper_noun: true } ] );
                expect(items_div.text()).toMatch(/.* Apple .*/);
                expect(items_div.text()).toNotMatch(/.* an Apple .*/);
            });
        });
    });

}());
