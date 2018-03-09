# Rock-paper-scissors

This project replicates the classic hand game rock-paper-scissors. 

## How to Play

To begin playing rock-paper-scissors, click <a href = "https://lkanand.github.io/RPS-Multiplayer/">here</a>. If the game does not already have two players, you can create your player by inputting a name into the form at the top and clicking the submit button. If you are the first player to submit this form, then you must wait for another user to create a player before you can begin playing. If there are already two people playing rock-paper-scissors, you will not be able to create your player until one of them exits the game (this program only supports two players at a time). You will know if a player has exited the game if one of the player boxes has the title "Waiting..." instead of a player name.  

### The Game

Once the program has two players, it follows the following sequence of events for each round:
* Player one is prompted to select either Rock, Paper or Scissors
    * Player two must wait for player one to make a decision
* After player one makes his / her decision, player two will be prompted to select either Rock, Paper or Scissors
    * Player one must wait for player two to make a decision
* Once player two makes his / her decision, the program will determine who won the round
    * Rock defeats scissors
    * Paper defeats rock
    * Scissors defeats paper
    * If both players choose the same option, then the round ends in a tie
* Each player's wins and losses total will be updated based on the result of the round
    * In the event of a tie, both player's wins and losses will remain the same 

The program will repeat this sequence of events as long as both players are using the program. When one of the users exists, the program will abort the game and modify the title of that user's player box to read "Waiting...". The other user will have to wait for another user to submit a player name before he / she can continue playing. 

### Chat

In addition to coordinating rounds of rock-paper-scissors, this program offers chat functionality. Once it has two players, it allows them to ~~communicate with~~ talk trash to each other by typing messages into the chat window at the bottom of the game screen. 

## Development

The core functionality for rock-paper-scissors was developed using a combination of jQuery and Firebase handlers. 

The program's jQuery handlers serve the following purposes: 
* Allow users to submit their player's name to the program
* Read each user's selection of rock, paper or scissors
* Allow users to submit messages to the chat screen 

Firebase handlers serve the following purposes: 
* Detect if the program has zero, one or two players
* Inform users of their opponents total wins and losses
* Detect when a player exits the game
* Detect when there are two players so that the program can initiate the game
* Detect when player one makes his / her choice
* Detect when player two makes his / her choice
* Prompt the program to start a new round
* Update the chat screen whenever a user submits a message

