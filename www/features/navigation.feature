Feature: Navigation
    In order to move through the game locations
    As a player
    I want to be able to navigate by clicking links

    Scenario: Click an exit link
        Given a location with an exit labelled 'Library' that goes to the library with a description 'Library description'
        When I click the exit 'Library'
        Then the current location description changes to 'Library description'

    @wip
    Scenario: Invisible exits are not shown
        Given a location with an exit labelled 'Library' that is invisible
        When I enter the location
        Then the current location exit list does not include 'Library'
