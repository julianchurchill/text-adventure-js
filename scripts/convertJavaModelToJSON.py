#!/usr/bin/python
import json
import sys
import unittest

class JavaModelConverter():
    sectionHeader = "";
    seperator = ':';
    propertiesSection = "PROPERTIES";
    locationAreaSection = "LOCATION AREA";
    inventoryItemSection = "INVENTORY ITEM";
    locationSection = "LOCATION";
    exitSection = "EXIT";
    itemSection = "ITEM";
    propertiesKey = "properties";
    locationAreasKey = "location_areas";
    inventoryItemsKey = "inventory_items";
    locationsKey = "locations";
    exitsKey = "exits";
    itemsKey = "items";
    output = [];
    properties = {};
    locationAreas = {};
    inventoryItems = {};
    locations = {};
    sectionHandlingFunctions = {};
    onNewSectionKey = "onNewSection";
    onNewValuesKey = "onNewValues";
    preProcessKeyKey = "preProcessKey";

    def __init__(self):
        self.output = [{self.propertiesKey:{}, self.locationAreasKey:[], self.inventoryItemsKey:[], self.locationsKey:[]}];
        self.properties = self.output[0][self.propertiesKey];
        self.locationAreas = self.output[0][self.locationAreasKey];
        self.inventoryItems = self.output[0][self.inventoryItemsKey];
        self.locations = self.output[0][self.locationsKey];
        self.sectionHandlingFunctions = {
            self.propertiesSection:{ self.onNewValuesKey:self.onNewPropertiesValues },
            self.locationAreaSection:{
                self.onNewSectionKey:self.onNewLocationAreaSection,
                self.onNewValuesKey:self.onNewLocationAreaValues,
                self.preProcessKeyKey:self.removeFirstWord },
            self.inventoryItemSection:{
                self.onNewSectionKey:self.onNewInventoryItemSection,
                self.onNewValuesKey:self.onNewInventoryItemValues,
                self.preProcessKeyKey:self.removeFirstWord },
            self.locationSection:{
                self.onNewSectionKey:self.onNewLocationSection,
                self.onNewValuesKey:self.onNewLocationValues,
                self.preProcessKeyKey:self.preProcessLocationKey },
            self.exitSection:{
                self.onNewSectionKey:self.onNewExitSection,
                self.onNewValuesKey:self.onNewExitValues,
                self.preProcessKeyKey:self.preProcessExitKey },
            self.itemSection:{
                self.onNewSectionKey:self.onNewItemSection,
                self.onNewValuesKey:self.onNewItemValues,
                self.preProcessKeyKey:self.removeFirstWord }
        };

    def convertToDictionaryFromFile(self, file):
        return self.convertToDictionaryFromLineList( file );

    def convertToDictionary(self, input):
        if input == "":
            return [];
        return self.convertToDictionaryFromLineList( input.splitlines() );

    def convertToDictionaryFromLineList(self, lines):
        self.sectionHeader = "";
        for line in lines:
            if self.isSectionHeader(line):
                self.processSectionHeader( line );
            else:
                self.processNonHeaderLine( line );
        return self.output;

    def processSectionHeader(self, line):
        self.sectionHeader = line;
        if self.sectionHeader in self.sectionHandlingFunctions:
            if self.onNewSectionKey in self.sectionHandlingFunctions[self.sectionHeader]:
                self.sectionHandlingFunctions[self.sectionHeader][self.onNewSectionKey]();

    def processNonHeaderLine(self, line):
        (key, values) = line.split(self.seperator,1)
        if values == "":
            values = "True";
        if self.sectionHeader in self.sectionHandlingFunctions:
            if self.preProcessKeyKey in self.sectionHandlingFunctions[self.sectionHeader]:
                key = self.sectionHandlingFunctions[self.sectionHeader][self.preProcessKeyKey]( key );
            if self.onNewValuesKey in self.sectionHandlingFunctions[self.sectionHeader]:
                self.sectionHandlingFunctions[self.sectionHeader][self.onNewValuesKey](key, values);

    def onNewLocationAreaSection(self):
        self.locationAreas.append({});

    def onNewLocationSection(self):
        self.locations.append({});

    def onNewExitSection(self):
        self.addEmptyMapToListInCurrentLocation( self.exitsKey );

    def onNewItemSection(self):
        self.addEmptyMapToListInCurrentLocation( self.itemsKey );

    def addEmptyMapToListInCurrentLocation(self, listKey):
        currentLocation = self.lastOf( self.locations );
        self.ensureListInDictIsInitialized( currentLocation, listKey );
        currentLocation[listKey].append({});

    def onNewInventoryItemSection(self):
        self.inventoryItems.append({});

    def replaceSpacesWithUnderscores(self, value):
        return value.replace(' ', '_');

    def onNewPropertiesValues(self, key, values):
        self.properties[self.replaceSpacesWithUnderscores(key)] = values;

    def onNewLocationAreaValues(self, key, values):
        self.lastOf( self.locationAreas )[self.replaceSpacesWithUnderscores(key)] = values;

    def onNewLocationValues(self, key, values):
        self.lastOf( self.locations )[self.replaceSpacesWithUnderscores(key)] = values;

    def onNewExitValues(self, key, values):
        currentLocation = self.lastOf( self.locations );
        currentExit = self.lastOf( currentLocation[self.exitsKey] );
        if key == "on use action":
            self.addActionWithArguments( currentExit, "use_actions", values );
        else:
            currentExit[self.replaceSpacesWithUnderscores(key)] = values;

    def onNewItemValues(self, key, values):
        currentLocation = self.lastOf( self.locations );
        currentItem = self.lastOf( currentLocation[self.itemsKey] );
        self.parseItem( key, values, currentItem );

    def onNewInventoryItemValues(self, key, values):
        self.parseItem( key, values, self.lastOf( self.inventoryItems ) );

    def parseItem(self, key, values, itemToPopulate):
        canBeUsedWithKey = "can_be_used_with";
        if key == "can be used with":
            self.ensureListInDictIsInitialized(itemToPopulate, canBeUsedWithKey);
            itemToPopulate[canBeUsedWithKey].append( {} );
            self.lastOf( itemToPopulate[canBeUsedWithKey] )["id"] = values;
        elif key == "successful use message":
            self.lastOf( itemToPopulate[canBeUsedWithKey] )[self.replaceSpacesWithUnderscores(key)] = values;
        elif key == "use action":
            self.addActionWithArguments( self.lastOf( itemToPopulate[canBeUsedWithKey] ), "use_actions", values );
        elif key == "on examine action":
            self.addActionWithArguments( itemToPopulate, "on_examine_actions", values );
        elif key == "talk initial phrase":
            self.addTalkPhraseWithArguments( itemToPopulate, "initial phrase", values );
        elif key == "talk response to":
            self.addTalkPhraseWithArguments( itemToPopulate, "response to", values );
        elif key == "talk follow up phrase to":
            self.addTalkPhraseWithArguments( itemToPopulate, "follow up phrase to", values );
        else:
            itemToPopulate[self.replaceSpacesWithUnderscores(key)] = values;

    def addTalkPhraseWithArguments(self, itemToPopulate, phrase_type, values ):
        talkPhrasesKey = "talk_phrases";
        self.ensureListInDictIsInitialized( itemToPopulate, talkPhrasesKey );
        arguments = values.split(self.seperator);
        itemToPopulate[talkPhrasesKey].append( { "type":phrase_type, "arguments":arguments } );

    def addActionWithArguments(self, itemToPopulate, actionsKey, values ):
        self.ensureListInDictIsInitialized( itemToPopulate, actionsKey );
        action_name = values.split(self.seperator)[0];
        arguments = values.split(self.seperator)[1:];
        itemToPopulate[actionsKey].append( { "action_name":action_name, "arguments":arguments } );

    def ensureListInDictIsInitialized(self, inDict, key):
        if key not in inDict:
            inDict[key] = [];

    def preProcessLocationKey(self, key):
        if key == "x" or key == "y" or key == "text to show on first entry":
            return key;
        return self.removeFirstWord(key);

    def preProcessExitKey(self, key):
        if key == "exit destination":
            return "destinationid";
        return self.removeFirstWord(key);

    def lastOf( self, thing ):
        return thing[-1];

    def removeFirstWord(self, input):
        return input.split(' ',1)[1];

    def isSectionHeader(self, line):
        return self.seperator not in line;

class TestScript(unittest.TestCase):

    empty_converted_dict = {"properties":{}, "location_areas":[], "inventory_items":[], "locations":[] };

    def createDict(self, valuesToAddToDict):
        return [dict(self.empty_converted_dict.items() + valuesToAddToDict.items())];

    def test_location_with_complex_item_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "LOCATION\nITEM\n"
                                    "item can be used with:another_id\nitem successful use message:some_text\n"
                                        "item use action:action_name:arg1:arg2\n"
                                        "item use action:action_name2:arg21:arg22\n"
                                    "item can be used with:another_id2\nitem successful use message:some_text2\n"
                                        "item use action:action_name:arg1:arg2\n"
                                    "item examine action is not repeatable:\nitem examine message:some_text\n"
                                        "item on examine action:action_name:arg1:arg2\n"
                                        "item on examine action:action_name2:arg21:arg22\n"
                                    "item talk initial phrase:arg1:arg2:arg3\n"
                                    "item talk response to:arg1:arg2\n"
                                    "item talk follow up phrase to:arg1:arg2:arg3:arg4\n"
                                    "item talk initial phrase:arg1:arg2:arg3\n"
                                    "item talk response to:arg1:arg2\n"
                                    "item talk follow up phrase to:arg1:arg2:arg3:arg4\n" ),
            self.createDict( {"locations":[
                {"items":[
                    { "can_be_used_with":[
                        { "id": "another_id", "successful_use_message":"some_text",
                          "use_actions":[
                            {"action_name":"action_name", "arguments":[ "arg1", "arg2" ]},
                            {"action_name":"action_name2", "arguments":[ "arg21", "arg22" ]} ]},
                        { "id": "another_id2", "successful_use_message":"some_text2",
                          "use_actions":[ {"action_name":"action_name", "arguments":[ "arg1", "arg2" ]} ]} ],
                    "examine_action_is_not_repeatable": "True", "examine_message":"some_text", "on_examine_actions":[
                      {"action_name":"action_name", "arguments":[ "arg1", "arg2" ]},
                      {"action_name":"action_name2", "arguments":[ "arg21", "arg22" ]} ],
                    "talk_phrases":[
                      {"type":"initial phrase", "arguments":["arg1","arg2","arg3"]},
                      {"type":"response to", "arguments":["arg1","arg2"]},
                      {"type":"follow up phrase to", "arguments":["arg1","arg2","arg3","arg4"]},
                      {"type":"initial phrase", "arguments":["arg1","arg2","arg3"]},
                      {"type":"response to", "arguments":["arg1","arg2"]},
                      {"type":"follow up phrase to", "arguments":["arg1","arg2","arg3","arg4"]} ]
                    }
                ]}
            ]}));

    def test_location_with_basic_item_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "LOCATION\nITEM\nitem name:item_name\nitem description:item_description\nitem id:item_id\n"
                                             "ITEM\nitem name:item_name2\nitem description:item_description2\nitem id:item_id2\n" ),
            self.createDict( {"locations":[
                {"items":[
                    { "name":"item_name", "description":"item_description", "id":"item_id" },
                    { "name":"item_name2", "description":"item_description2", "id":"item_id2" }
                ]}]}));

    def test_location_with_exit_with_actions_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "LOCATION\nEXIT\nexit on use action:action_name:arg1:arg2\nexit on use action:action_name2:arg1:arg2\n" ),
            self.createDict( {"locations":[
                    {"exits": [{"use_actions":[{"action_name":"action_name", "arguments":["arg1","arg2"]},
                                               {"action_name":"action_name2", "arguments":["arg1","arg2"]}]}]}
                ]}));

    def test_location_with_basic_exit_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "LOCATION\nEXIT\nexit label:some_label\nexit destination:some_destination_id\nexit direction hint:some_direction_hint\n"
                                    "exit id:some_id\nexit is not visible:\n" ),
            self.createDict( {"locations":[
                    {"exits": [{"label":"some_label", "destinationid":"some_destination_id", "direction_hint":"some_direction_hint",
                                "id":"some_id", "is_not_visible":"True" }]}
                ]}));

    def test_basic_location_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "LOCATION\nx:300\ny:480\nlocation id:some_id\nlocation area id:some_area_id\nlocation description:some_text\n"
                                   "text to show on first entry:some_more_text\n" ),
            self.createDict( {"locations":[
                    {"x":"300", "y":"480", "id":"some_id", "area_id":"some_area_id", "description":"some_text", "text_to_show_on_first_entry":"some_more_text"}
                ]}));

    def test_inventory_item_talk_phrases_are_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "INVENTORY ITEM\n"
                                    "item talk initial phrase:arg1:arg2:arg3\n"
                                    "item talk response to:arg1:arg2\n"
                                    "item talk follow up phrase to:arg1:arg2:arg3:arg4\n"
                                    "item talk initial phrase:arg1:arg2:arg3\n"
                                    "item talk response to:arg1:arg2\n"
                                    "item talk follow up phrase to:arg1:arg2:arg3:arg4\n" ),
            self.createDict( {"inventory_items":[
                    { "talk_phrases":[
                        {"type":"initial phrase", "arguments":["arg1","arg2","arg3"]},
                        {"type":"response to", "arguments":["arg1","arg2"]},
                        {"type":"follow up phrase to", "arguments":["arg1","arg2","arg3","arg4"]},
                        {"type":"initial phrase", "arguments":["arg1","arg2","arg3"]},
                        {"type":"response to", "arguments":["arg1","arg2"]},
                        {"type":"follow up phrase to", "arguments":["arg1","arg2","arg3","arg4"]}
                    ]},
                ]}));

    def test_inventory_item_examine_actions_with_arguments_are_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "INVENTORY ITEM\nitem examine action is not repeatable:\nitem examine message:some_text\nitem on examine action:action_name:arg1:arg2\n"
                                   "item on examine action:action_name2:arg21:arg22\n" ),
            self.createDict( {"inventory_items":[
                    { "examine_action_is_not_repeatable": "True", "examine_message":"some_text", "on_examine_actions":[
                        {"action_name":"action_name", "arguments":[ "arg1", "arg2" ]},
                        {"action_name":"action_name2", "arguments":[ "arg21", "arg22" ]},
                    ]},
                ]}));

    def test_inventory_item_use_with_actions_with_arguments_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "INVENTORY ITEM\nitem can be used with:another_id\nitem successful use message:some_text\nitem use action:action_name:arg1:arg2\n"
                                                   "item can be used with:another_id2\nitem successful use message:some_text2\nitem use action:action_name2:arg21:arg22\n" ),
            self.createDict( {"inventory_items":[ { "can_be_used_with":[
                    { "id": "another_id", "successful_use_message":"some_text", "use_actions":[ {"action_name":"action_name", "arguments":[ "arg1", "arg2" ]} ] },
                    { "id": "another_id2", "successful_use_message":"some_text2", "use_actions":[ {"action_name":"action_name2", "arguments":[ "arg21", "arg22" ]} ] }
                ]}]}));

    def test_inventory_item_boolean_flags_are_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "INVENTORY ITEM\nitem is untakeable:\nitem is proper noun:\nitem is plural:\n" ),
            self.createDict( {"inventory_items":[ { "is_untakeable":"True", "is_proper_noun":"True", "is_plural":"True" } ]}));

    def test_basic_inventory_items_are_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary(
                "INVENTORY ITEM\nitem name:item_name\nitem description:item_description\nitem id:item_id\n"
                "INVENTORY ITEM\nitem name:item_name2\nitem description:item_description2\nitem id:item_id2\n" ),
            self.createDict(
                {"inventory_items":[
                    { "name":"item_name", "description":"item_description", "id":"item_id" },
                    { "name":"item_name2", "description":"item_description2", "id":"item_id2" }
                ]}));

    def test_location_areas_are_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary(
                "LOCATION AREA\nlocation area id:area_id\nlocation area name:area_name\n"
                "LOCATION AREA\nlocation area id:area_id2\nlocation area name:area_name2\n" ),
            self.createDict(
                {"location_areas":[
                    {"area_id":"area_id", "area_name":"area_name"},
                    {"area_id":"area_id2", "area_name":"area_name2"}
                ]}));

    def test_maximum_score_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "PROPERTIES\nmaximum score:27" ),
            self.createDict( {"properties":{"maximum_score":"27"}} ));

    def test_from_nothing_comes_nothing(self):
        j = JavaModelConverter();
        self.assertEqual( j.convertToDictionary( "" ), []);

    def test_golden_ticket(self):
        goldenTicketInput = """
PROPERTIES
maximum score:27

INVENTORY ITEM
item name:some_name
item description:some_description
item countable noun prefix:a_prefix
item mid sentence cased name:some cased name
item is untakeable:
item visibility:invisible
item is proper noun:
item is plural:
item id:some_id
item can be used with:another_id
item successful use message:some_text
item use action:action_name:action_arg1:action_arg2
item use action:action_name2:action2_arg1:action2_arg2
item can be used with:another_id2
item successful use message:some_text2
item use action:action_name:action_arg1:action_arg2
item use action:action_name2:action2_arg1:action2_arg2
item examine action is not repeatable:
item examine message:some examine message
item on examine action:action_name:action_arg1:action_arg2
item on examine action:action_name2:action2_arg1:action2_arg2
item talk initial phrase:arg1:arg2:arg3
item talk response to:arg1:arg2
item talk follow up phrase to:arg1:arg2:arg3:arg4
item talk initial phrase:arg1:arg2:arg3
item talk response to:arg1:arg2
item talk follow up phrase to:arg1:arg2:arg3:arg4

LOCATION AREA
location area id:area_id
location area name:area_name

LOCATION
x:300
y:480
location id:some_location_id
location area id:some_area_id
location description:some_location_description
text to show on first entry:some_text
EXIT
exit label:some_exit_label
exit destination:some_destination_id
exit direction hint:some_direction_hint
exit id:some_exit_id
exit is not visible:
exit on use action:action_name:action_arg1:action_arg2
exit on use action:action_name2:action2_arg1:action2_arg2
EXIT
exit label:some_exit_label2
exit destination:some_destination_id2
exit id:some_exit_id2
ITEM
item name:some_name
item description:some_description
item id:some_id
ITEM
item name:some_name2
item description:some_description2
item id:some_id2
"""

        j = JavaModelConverter();
        self.assertEqual( j.convertToDictionary( goldenTicketInput ), [{
            "properties":{
                "maximum_score": "27"
            },
            "inventory_items": [
                {
                    "name":"some_name",
                    "description":"some_description",
                    "countable_noun_prefix":"a_prefix",
                    "mid_sentence_cased_name":"some cased name",
                    "is_untakeable":"True",
                    "visibility":"invisible",
                    "is_proper_noun":"True",
                    "is_plural":"True",
                    "id":"some_id",
                    "can_be_used_with":[
                        {
                            "id":"another_id",
                            "successful_use_message":"some_text",
                            "use_actions":[
                                {
                                    "action_name":"action_name",
                                    "arguments":["action_arg1", "action_arg2"]},
                                {
                                    "action_name":"action_name2",
                                    "arguments":["action2_arg1", "action2_arg2"]}
                            ]
                        },
                        {
                            "id":"another_id2",
                            "successful_use_message":"some_text2",
                            "use_actions":[
                                {
                                    "action_name":"action_name",
                                    "arguments":["action_arg1", "action_arg2"]},
                                {
                                    "action_name":"action_name2",
                                    "arguments":["action2_arg1", "action2_arg2"]}
                            ]
                        }
                    ],
                    "examine_action_is_not_repeatable":"True",
                    "examine_message":"some examine message",
                    "on_examine_actions":[
                        {"action_name":"action_name", "arguments":["action_arg1","action_arg2"]},
                        {"action_name":"action_name2", "arguments":["action2_arg1","action2_arg2"]}
                    ],
                    "talk_phrases":[
                        {"type":"initial phrase", "arguments":["arg1","arg2","arg3"]},
                        {"type":"response to", "arguments":["arg1","arg2"]},
                        {"type":"follow up phrase to", "arguments":["arg1","arg2","arg3","arg4"]},
                        {"type":"initial phrase", "arguments":["arg1","arg2","arg3"]},
                        {"type":"response to", "arguments":["arg1","arg2"]},
                        {"type":"follow up phrase to", "arguments":["arg1","arg2","arg3","arg4"]}
                    ]
                }
            ],
            "location_areas": [{ "area_id":"area_id", "area_name":"area_name" }],
            "locations": [
                {
                    "x":"300",
                    "y":"480",
                    "id":"some_location_id",
                    "area_id":"some_area_id",
                    "description":"some_location_description",
                    "text_to_show_on_first_entry":"some_text",
                    "exits":[
                        {
                            "label":"some_exit_label",
                            "destinationid":"some_destination_id",
                            "direction_hint":"some_direction_hint",
                            "id":"some_exit_id",
                            "is_not_visible":"True",
                            "use_actions":[
                                {"action_name":"action_name", "arguments":["action_arg1", "action_arg2"]},
                                {"action_name":"action_name2", "arguments":["action2_arg1", "action2_arg2"]},
                            ]
                        },
                        {
                            "label":"some_exit_label2",
                            "destinationid":"some_destination_id2",
                            "id":"some_exit_id2"
                        }
                    ],
                    "items":[
                        {
                            "name":"some_name",
                            "description":"some_description",
                            "id":"some_id"
                        },
                        {
                            "name":"some_name2",
                            "description":"some_description2",
                            "id":"some_id2"
                        }
                    ]
                }
            ]
        }]);

if __name__ == '__main__':
    if len( sys.argv ) == 2 and sys.argv[1] != None:
        with open(sys.argv[1]) as f:
            linesWithoutNewlines = [ line.strip('\n') for line in f.readlines() ]
            print json.dumps( JavaModelConverter().convertToDictionaryFromLineList( linesWithoutNewlines ), indent=2 );
    else:
        unittest.main();
