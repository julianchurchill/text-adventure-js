Feature: Actions
    In order to interact with the game
    As a player
    I want to be able to trigger actions by clicking on links or pressing buttons

    @wip
    Scenario: Show inventory displays the inventory
        Given an inventory containing an item named 'Pocket knife'
        When I click the action 'Show inventory'
        Then the inventory list is shown
        And the inventory list contains 'Pocket knife'

    @future
    Scenario: Show inventory can be cancelled
        Given an inventory containing an item named 'Pocket knife'
        When I click the action 'Show inventory'
        And click the browser back button
        Then the inventory list is not visible

    @future
    Scenario: Click an action link
        Given a location with an action labelled 'Take banana' has a 'banana' item
        When I click the action 'Take banana'
        Then the current location item list no longer includes 'banana'
        And the current location action list no longer includes 'Take banana'
