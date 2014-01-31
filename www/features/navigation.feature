Feature: Navigation
    In order to move through the game locations
    As a player
    I want to be able to navigate by clicking links

    @wip
    Scenario: Click an exit link
        Given a location with an exit labelled 'Library' that goes to the library
        When I click the exit 'Library'
        Then the current location description changes to 'Library description'
