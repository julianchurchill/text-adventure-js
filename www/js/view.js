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

    function createNewExitLink(exit,view) {
        var exit_id = exit.id;
        var new_link = document.createElement( 'a' );
        new_link.id = exit_id;
        new_link.appendChild(document.createTextNode(exit.label));
        new_link.onclick = function() {
            view.actionHandler.exitTriggered( exit_id );
        }
        return new_link;
    };

    function clearExits() {
        clearSelector('#exits');
    }

    function addExitsPrecursorText(newExits) {
        if ( newExits.length > 0 )
            addTextToSelector('#exits',"The following exits are available: ");
        else
            addTextToSelector('#exits',"There are no exits visible.");
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
        addTextToSelector('#items', items);
    };

    View.prototype.onActionsChanged = function(newActions) {
    };

    module.exports = View;
})();
