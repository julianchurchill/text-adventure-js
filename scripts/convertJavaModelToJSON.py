#!/usr/bin/python
import unittest

class JavaModelConverter():
    seperator = ':';
    propertiesSection = "PROPERTIES";
    locationAreaSection = "LOCATION AREA";
    inventoryItemSection = "INVENTORY ITEM";
    propertiesKey = "properties";
    locationAreasKey = "location areas";
    inventoryItemsKey = "inventory items";
    output = [];
    locationAreas = {};
    inventoryItems = {};
    sectionHandlingFunctions = {};
    onNewSectionKey = "onNewSection";
    onNewValuesKey = "onNewValues";

    def __init__(self):
        self.output = [{self.propertiesKey:{}, self.locationAreasKey:[], self.inventoryItemsKey:[]}];
        self.locationAreas = self.output[0][self.locationAreasKey];
        self.inventoryItems = self.output[0][self.inventoryItemsKey];
        self.sectionHandlingFunctions = {
            self.propertiesSection:{self.onNewSectionKey:self.onNewPropertiesSection, self.onNewValuesKey:self.onNewPropertiesValues},
            self.locationAreaSection:{self.onNewSectionKey:self.onNewLocationAreaSection, self.onNewValuesKey:self.onNewLocationValues},
            self.inventoryItemSection:{self.onNewSectionKey:self.onNewInventoryItemSection, self.onNewValuesKey:self.onNewInventoryItemValues}
        };

    def convertToDictionary(self, input):
        if input == "":
            return [];
        sectionHeader = "";
        for line in input.splitlines():
            if self.isSectionHeader(line):
                sectionHeader = line;
                if sectionHeader in self.sectionHandlingFunctions:
                    if self.onNewSectionKey in self.sectionHandlingFunctions[sectionHeader]:
                        self.sectionHandlingFunctions[sectionHeader][self.onNewSectionKey]();
            else:
                (key, values) = line.split(self.seperator,1)
                if values == "":
                    values = "True";
                if sectionHeader in self.sectionHandlingFunctions:
                    if self.onNewValuesKey in self.sectionHandlingFunctions[sectionHeader]:
                        self.sectionHandlingFunctions[sectionHeader][self.onNewValuesKey](key, values);
        return self.output;

    def onNewLocationAreaSection(self):
        self.locationAreas.append({});

    def onNewPropertiesSection(self):
        pass;

    def onNewInventoryItemSection(self):
        self.inventoryItems.append({});

    def onNewPropertiesValues(self, key, values):
        self.output[0][self.propertiesKey][key] = values;

    def onNewLocationValues(self, key, values):
        self.addKeyValueToLastDictIn( self.locationAreas, key, values );

    def onNewInventoryItemValues(self, key, values):
        self.addKeyValueToLastDictIn( self.inventoryItems, key, values );

    def addKeyValueToLastDictIn( self, listToAddTo, key, values ):
        listToAddTo[-1][self.removeFirstWord(key)] = values;

    def removeFirstWord(self, input):
        return input.split(' ',1)[1];

    def isSectionHeader(self, line):
        return self.seperator not in line;

class TestScript(unittest.TestCase):

    empty_converted_dict = {"properties":{}, "location areas":[], "inventory items":[]};

    def createDict(self, valuesToAddToDict):
        return [dict(self.empty_converted_dict.items() + valuesToAddToDict.items())];

    def test_inventory_item_talk_phrases_are_parsed(self):
        pass;

    def test_inventory_item_examine_actions_are_parsed(self):
        pass;

    def test_inventory_item_use_actions_are_parsed(self):
        pass;

    def test_inventory_item_boolean_flags_are_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "INVENTORY ITEM\nitem is untakeable:\nitem is proper noun:\nitem is plural:\n" ),
            self.createDict( {"inventory items":[ { "is untakeable":"True", "is proper noun":"True", "is plural":"True" } ]}));

    def test_basic_inventory_item_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary(
                "INVENTORY ITEM\nitem name:item_name\nitem description:item_description\nitem id:item_id\n"
                "INVENTORY ITEM\nitem name:item_name2\nitem description:item_description2\nitem id:item_id2\n" ),
            self.createDict(
                {"inventory items":[
                    { "name":"item_name", "description":"item_description", "id":"item_id" },
                    { "name":"item_name2", "description":"item_description2", "id":"item_id2" }
                ]}));

    def test_location_area_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary(
                "LOCATION AREA\nlocation area id:area_id\nlocation area name:area_name\n"
                "LOCATION AREA\nlocation area id:area_id2\nlocation area name:area_name2\n" ),
            self.createDict(
                {"location areas":[
                    {"area id":"area_id", "area name":"area_name"},
                    {"area id":"area_id2", "area name":"area_name2"}
                ]}));

    def test_maximum_score_is_parsed(self):
        j = JavaModelConverter();
        self.assertEqual(
            j.convertToDictionary( "PROPERTIES\nmaximum score:27" ),
            self.createDict( {"properties":{"maximum score":"27"}} ));

    def test_from_nothing_comes_nothing(self):
        j = JavaModelConverter();
        self.assertEqual( j.convertToDictionary( "" ), []);

    # Once it all works comment this test title back in to keep the golden ticket test running
    # def test_golden_ticket(self):
    def golden_ticket(self):
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
item talk initial phrase:helpme:Can you help me?:"Can you help me?" you say to the younger girl.
item talk response to:helpme:She looks at you moving forward but Oubliette pulls her back and tells her to keep away from you.
item talk follow up phrase to:helpme:sorehead:Sore.:"Sore. Why on earth did you hit me? And why am I tied up?!". Exasperated, you feel like chucking the towel in. After fighting your way past that beast only to be knocked out cold by a girl and now with a cracking headache, you wish someone would enlighten you as to what is going on.
item talk initial phrase:isthataboot:Is that a boot behind your back?:"Is that a boot behind your back?" you say to the younger girl.
item talk response to:isthataboot: She spins round on one leg with unsettling glee so that you can clearly see the large leather boot she is holding then she sticks out her tongue and blows a big raspberry at you. Oubliette looks at her sternly and tells her off in a terse whisper.
item talk follow up phrase to:helpme:sorehead:Sore.:"Sore. Why on earth did you hit me? And why am I tied up?!". Exasperated, you feel like chucking the towel in. After fighting your way past that beast only to be knocked out cold by a girl and now with a cracking headache, you wish someone would enlighten you as to what is going on.

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
                "maximum score": "27"
            },
            "inventory items": [
                {
                    "name":"some_name",
                    "description":"some_description",
                    "countable noun prefix":"a_prefix",
                    "mid sentence cased name":"some cased name",
                    "is untakeable":"True",
                    "visibility":"invisible",
                    "is proper noun":"True",
                    "is plural":"True",
                    "id":"some_id",
                    "can be used with":[
                        {
                            "id":"another_id",
                            "successful use message":"some_text",
                            "use actions":[
                                {
                                    "action name":"action_name",
                                    "arguments":["action_arg1", "action_arg2"]},
                                {
                                    "action name":"action_name2",
                                    "arguments":["action2_arg1", "action2_arg2"]}
                            ]
                        },
                        {
                            "id":"another_id2",
                            "successful use message":"some_text2",
                            "use actions":[
                                {
                                    "action name":"action_name",
                                    "arguments":["action_arg1", "action_arg2"]},
                                {
                                    "action name":"action_name2",
                                    "arguments":["action2_arg1", "action2_arg2"]}
                            ]
                        }
                    ],
                    "examine action is not repeatable":"True",
                    "examine message":"some examine message",
                    "on examine actions":[
                        {"action name":"action_name", "arguments":["action_arg1","action_arg2"]},
                        {"action name":"action_name2", "arguments":["action2_arg1","action2_arg2"]}
                    ]
                }
            ],
            "location areas": [{ "area id":"area_id", "area name":"area_name" }],
            "locations": [
                {
                    "x":"300",
                    "y":"480",
                    "id":"some_location_id",
                    "area id":"some_area_id",
                    "description":"some_location_description",
                    "text to show on first entry":"some_text",
                    "exits":[
                        {
                            "label":"some_exit_label",
                            "destination":"some_destination_id",
                            "direction hint":"some_direction_hint",
                            "id":"some_exit_id",
                            "is not visible":"True",
                            "use actions":[
                                {"action name":"action_name", "arguments":["action_arg1", "action_arg2"]},
                                {"action name":"action_name2", "arguments":["action2_arg1", "action2_arg2"]},
                            ]
                        },
                        {
                            "label":"some_exit_label2",
                            "destination":"some_destination_id2",
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

    # def setUp(self):
    #     self.seq = range(10)

    # def test_shuffle(self):
    #     # make sure the shuffled sequence does not lose any elements
    #     random.shuffle(self.seq)
    #     self.seq.sort()
    #     self.assertEqual(self.seq, range(10))

    #     # should raise an exception for an immutable sequence
    #     self.assertRaises(TypeError, random.shuffle, (1,2,3))

    # def test_choice(self):
    #     element = random.choice(self.seq)
    #     self.assertTrue(element in self.seq)

    # def test_sample(self):
    #     with self.assertRaises(ValueError):
    #         random.sample(self.seq, 20)
    #     for element in random.sample(self.seq, 5):
    #         self.assertTrue(element in self.seq)

if __name__ == '__main__':
    unittest.main()
