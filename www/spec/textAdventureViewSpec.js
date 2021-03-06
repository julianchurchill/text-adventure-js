/*global global, setFixtures*/

(function () {
    "use strict";

    // JQuery requires a window with a document so...
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

        describe('when receiving a description changed event', function() {
            it('should replace description text with new description', function() {
                description_div.text('old description');
                view.onDescriptionChanged( "new description" );
                expect(description_div.text()).toEqual('new description');
            });
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

            it('should wrap exits precursor in its own div', function() {
                view.onExitsChanged( [] );
                expect($('#exits_precursor').text()).toEqual('There are no exits visible.');
                expect($('#exits_precursor').hasClass('exits_precursor')).toEqual(true);
            });

            it('should give each exit the correct css class', function() {
                view.onExitsChanged( [ { id: 'exit_id1', label: "label1" } ] );
                expect($('#exit_id1').hasClass('exit')).toEqual(true);
            });

            it('should give each exit the css class matching the exit hint', function() {
                view.onExitsChanged( [ { id: 'exit_id1', label: "label1", direction_hint: "north" },
                                       { id: 'exit_id2', label: "label2", direction_hint: "south" },
                                       { id: 'exit_id3', label: "label3", direction_hint: "east" },
                                       { id: 'exit_id4', label: "label4", direction_hint: "west" },
                                       { id: 'exit_id5', label: "label5", direction_hint: "unknown" },
                                       { id: 'exit_id6', label: "label6" },
                                        ] );
                expect($('#exit_id1').hasClass('north_direction')).toEqual(true);
                expect($('#exit_id2').hasClass('south_direction')).toEqual(true);
                expect($('#exit_id3').hasClass('east_direction')).toEqual(true);
                expect($('#exit_id4').hasClass('west_direction')).toEqual(true);
                expect($('#exit_id5').hasClass('dontcare_direction')).toEqual(true);
                expect($('#exit_id6').hasClass('dontcare_direction')).toEqual(true);
            });

            it('ignores case of exit hint', function() {
                view.onExitsChanged( [ { id: 'exit_id1', label: "label1", direction_hint: "NoRtH" } ] );
                expect($('#exit_id1').hasClass('north_direction')).toEqual(true);
            });
        });

        describe('when user selects an exit', function() {
            it('should call back to action handler with exit id', function() {
                var actionHandler = jasmine.createSpyObj('actionHandler', ['exitTriggered']);
                view.setActionHandler(actionHandler);
                view.onExitsChanged( [ { id: 'exit_id1', label: "label1" } ] );

                $('#exit_id1').click();

                expect(actionHandler.exitTriggered).toHaveBeenCalledWith('exit_id1');
            });
        });

        describe('when receiving an items changed event', function() {
            it('should replace old items text', function() {
                items_div.text('old items');
                view.onItemsChanged( [] );
                expect(items_div.text()).toEqual('');
            });

            it('should use blank items text when no items available ', function() {
                view.onItemsChanged( [] );
                expect(items_div.text()).toEqual('');
            });

            it('should end item text with here.', function() {
                view.onItemsChanged( [ { name: "name" } ] );
                expect(items_div.text()).toMatch(/.* here./);
            });

            it('should use mid sentence cased name in preference to name if specified', function() {
                view.onItemsChanged( [ { name: "apples", mid_sentence_cased_name: "Apples" } ] );
                expect(items_div.text()).toMatch(/.* Apples/);
            });

            it('should use name if mid sentence cased name is not supplied', function() {
                view.onItemsChanged( [ { name: "apples" } ] );
                expect(items_div.text()).toMatch(/.* apples/);
            });

            it('should use "There is" if first item plurality is not specified', function() {
                view.onItemsChanged( [ { name: "apples" } ] );
                expect(items_div.text()).toMatch(/There is .*/);
            });

            it('should use "There is" if first item is not plural', function() {
                view.onItemsChanged( [ { name: "apples", is_plural: false } ] );
                expect(items_div.text()).toMatch(/There is .*/);
            });

            it('should use "There are" if first item is plural', function() {
                view.onItemsChanged( [ { name: "apples", is_plural: true } ] );
                expect(items_div.text()).toMatch(/There are .*/);
            });

            it('should cause item names to appear in the order they are supplied', function() {
                view.onItemsChanged( [ { name: "name1" },
                                       { name: "name2" },
                                       { name: "name3" } ] );
                expect(items_div.text()).toMatch(/.* name1.* name2.* name3 .*/);
            });

            it('should use "a" as the item indefinite article when no other is supplied', function() {
                view.onItemsChanged( [ { name: "apple" } ] );
                expect(items_div.text()).toMatch(/.* a apple .*/);
            });

            it('should cause item indefinite article to be used when supplied', function() {
                view.onItemsChanged( [ { name: "apple", indefinite_article: "an" } ] );
                expect(items_div.text()).toMatch(/.* an apple .*/);
            });

            it('should override indefinite article with "some" if item is plural', function() {
                view.onItemsChanged( [ { name: "apples", indefinite_article: "an", is_plural: true } ] );
                expect(items_div.text()).toMatch(/.* some apples .*/);
            });

            it('should cause no item indefinite article to be used if item is a proper noun', function() {
                view.onItemsChanged( [ { name: "Apple", indefinite_article: "an", is_proper_noun: true } ] );
                expect(items_div.text()).toMatch(/.* Apple .*/);
                expect(items_div.text()).toNotMatch(/.* an Apple .*/);
            });
        });
    });

}());
