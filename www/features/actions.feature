Feature: Actions
    In order to interact with the game
    As a player
    I want to be able to trigger actions by clicking on links

    @wip
    Scenario: Click an action link
        Given a location with an action labelled 'Take banana' has a 'banana' item
        When I click the action 'Take banana'
        Then the current location item list no longer includes 'banana'
        And the current location action list no longer includes 'Take banana'
