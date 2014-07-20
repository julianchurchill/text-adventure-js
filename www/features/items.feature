Feature: Items
    In order to have things to interact with
    As a player
    I want to be able to see and examine items

    Scenario: Items are visible when entering a location
        Given a location has an item named 'banana'
        When I enter the location
        Then the current location item list includes 'banana'
