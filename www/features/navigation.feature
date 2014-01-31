Feature: Navigation
    In order to move through the game locations
    As a player
    I want to be able to navigate by clicking links

    Scenario: Click an exit link
        Given a location with an exit labelled 'Library' that goes to the library
        When I click the exit 'Library'
        Then the current location description changes to 'Library description'

    @wip
    Scenario: Items are visible when entering a location
        Given a location has an item labelled 'banana'
        When I enter the location
        Then the current location item list includes 'banana'

    @future
    Scenario: Click an action link
        Given a location with an action labelled 'Take banana' has a 'banana' item
        When I click the action 'Take banana'
        Then the current location item list no longer includes 'banana'
        And the current location action list no longer includes 'Take banana'
