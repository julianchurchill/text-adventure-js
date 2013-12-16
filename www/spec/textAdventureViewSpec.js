/*global global, setFixtures*/

(function () {
    "use strict";

    // Create fake 'document' with jsdom
    var jsdom = require('jsdom');
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = window.document;

    var $ = require('jquery');
    // jasmine-jquery needs a global definition to jQuery like this
    global.jQuery = $;
    var jasmine_jquery = require('jasmine-jquery');

    describe('TextAdventureView', function() {
        var View = require('../js/view.js');
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

            it('should create links out of exit labels', function() {
                view.onExitsChanged( [ { id: 'exit_id1', label: "label1" } ] );
                expect($('#exit_id1')).toBe('a');
                expect($('#exit_id1').text()).toEqual('label1');
            });
            // it('exit links should call back to action handler with exit id', function() {
            //     expect(actionHandler.exitTriggered).toHaveBeenCalledWith( exit_id );
            // });
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
