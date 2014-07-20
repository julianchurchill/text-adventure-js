/*global module, exports*/

(function () {
    "use strict";

    function View() {
    }

    function addChildToSelector(selector, child) {
        document.querySelector(selector).appendChild(child);
    }

    function addTextToSelector(selector, text) {
        addChildToSelector(selector,document.createTextNode(text));
    }

    function setHtmlOnSelector(selector, html) {
        document.querySelector(selector).innerHTML = html;
    }

    function clearSelector(selector) {
        setHtmlOnSelector(selector,'');
    }

    View.prototype.setActionHandler = function(handler) {
        this.actionHandler = handler;
    };

    View.prototype.onDescriptionChanged = function(newDescription) {
        clearSelector('#description');
        addTextToSelector('#description', newDescription);
    };

    function updateCSSClassesWithDirectionHint( new_link, exit ) {
        if( exit.direction_hint !== undefined ) {
            var d = exit.direction_hint.toLowerCase();
            if( d === 'north' )
                new_link.className += ' north_direction';
            else if( d === 'south' )
                new_link.className += ' south_direction';
            else if( d === 'west' )
                new_link.className += ' west_direction';
            else if( d === 'east' )
                new_link.className += ' east_direction';
            else
                new_link.className += ' dontcare_direction';
        }
        else
            new_link.className += ' dontcare_direction';
    }

    function createNewExitLink(exit,view) {
        var exit_id = exit.id;
        var new_link = document.createElement( 'a' );
        new_link.id = exit_id;
        new_link.className = 'exit';
        updateCSSClassesWithDirectionHint( new_link, exit );
        new_link.appendChild(document.createTextNode(exit.label));
        new_link.onclick = function() {
            view.actionHandler.exitTriggered( exit_id );
        }
        return new_link;
    };

    function clearExits() {
        clearSelector('#exits');
    }

    var exits_precursor_id = 'exits_precursor';

    function addExitsPrecursorText(newExits) {
        if( document.querySelector('#exits_precursor') === null ) {
            var d = document.createElement('div');
            d.setAttribute('id', exits_precursor_id);
            d.className = 'exits_precursor';
            addChildToSelector('#exits',d);
        }
        if ( newExits.length > 0 )
            addChildToSelector('#exits_precursor',document.createTextNode("The following exits are available: "));
        else
            addChildToSelector('#exits_precursor',document.createTextNode("There are no exits visible."));
    }

    function addLinkForEachExit(newExits,view) {
        for( var i = 0 ; i < newExits.length; i++ ) {
            addChildToSelector('#exits',createNewExitLink(newExits[i],view));
            if( i !== (newExits.length-1) )
                addTextToSelector('#exits',', ');
        }
    }

    View.prototype.onExitsChanged = function(newExits) {
        clearExits();
        addExitsPrecursorText(newExits);
        addLinkForEachExit(newExits,this);
    };

    function addItemsPrecursorText(newItems) {
        if ( newItems.length > 0 ) {
            var precursorText = "There";
            if( newItems[0].plural !== undefined && newItems[0].plural === true )
                precursorText += " are";
            else
                precursorText += " is";
            addTextToSelector('#items', precursorText);
        }
    }

    function addIndefiniteArticleForItemText(item) {
        var indefinite_article = " a";
        if( item.indefinite_article !== undefined )
            indefinite_article = " " + item.indefinite_article;
        if( item.plural !== undefined && item.plural === true )
            indefinite_article = " some";
        if( item.proper_noun !== undefined && item.proper_noun  === true )
            indefinite_article = "";
        addTextToSelector('#items', indefinite_article);
    }

    function addItemTextSeperator(newItems,currentItemIndex) {
        if( newItems.length > 1 ) {
            if( currentItemIndex === (newItems.length-2) )
                addTextToSelector('#items', " and");
            else if( currentItemIndex !== (newItems.length-1) )
                addTextToSelector('#items', ",");
        }
    }

    function addTextForEachItem(newItems) {
        for( var i = 0 ; i < newItems.length; i++ ) {
            addIndefiniteArticleForItemText(newItems[i]);
            var name = newItems[i].name;
            if( newItems[i].mid_sentence_cased_name !== undefined && newItems[i].mid_sentence_cased_name !== "" )
                name = newItems[i].mid_sentence_cased_name;
            addTextToSelector('#items', " " + name);
            addItemTextSeperator(newItems,i);
        }
    }

    function addItemsSuccessorText(newItems) {
        if ( newItems.length > 0 )
            addTextToSelector('#items', ' here.');
    }

    View.prototype.onItemsChanged = function(newItems) {
        clearSelector('#items');
        addItemsPrecursorText(newItems);
        addTextForEachItem(newItems);
        addItemsSuccessorText(newItems);
    };

    View.prototype.onActionsChanged = function(newActions) {
    };

    module.exports = View;
})();
