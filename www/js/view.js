/*global module, exports*/

(function () {
    "use strict";

    function View() {
    }

    function setTextOnSelector(selector, text) {
        document.querySelector(selector).appendChild(document.createTextNode(text));
    }

    function setHtmlOnSelector(selector, html) {
        document.querySelector(selector).innerHTML = html;
    }

    View.prototype.onDescriptionChanged = function(newDescription) {
        setTextOnSelector('#description', newDescription);
    };

    View.prototype.onExitsChanged = function(newExits) {
        var exits = "";
        if ( newExits.length > 0 ) {
            exits = "The following exits are available:";
            for( var i = 0 ; i < newExits.length; i++ ) {
                exits += " " + "<a id=" + "'" + newExits[i].id + "'" + ">" + newExits[i].label + "</a>";
                if( i !== (newExits.length-1) )
                    exits += ",";
            }
        } else {
            exits = "There are no exits visible.";
        }
        setHtmlOnSelector('#exits', exits);
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
        setTextOnSelector('#items', items);
    };

    View.prototype.onActionsChanged = function(newActions) {
    };

    module.exports = View;
})();
