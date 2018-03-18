// A function that selects a random integer between a given min and max
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// A function that determines if two arrays of the same length are equal
function arraysEqual(arrA, arrB) {
  for (var i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false
    }
  }

  return true
}

// The Game object
function Game(list) {
  // Store the list of all taylor songs
  this.allSongsList = list;

  // Total number of user wins, initially zero
  this.totalWins = 0;

  // Total number of user losses, initially zero
  this.totalLosses = 0;

  // Set up a new game
  this.setupNewGame = function() {
    // Select a random taylor song from the list
    var randomNum = getRandomIntInclusive(0, this.allSongsList.length - 1);
    this.songLink = this.allSongsList[randomNum];
    this.song = this.songLink.toLowerCase();

    // Create a list of characters for the song string
    this.songList = this.song.split('');

    // Create the letters guessed list, initially containing dashes
    var guessList = [];
    var lettersTotal = 0;
    for (var i = 0; i < this.songList.length; i++) {
      if (this.songList[i] !== " ") { // if letter, put dash
        guessList.push("_");
        lettersTotal ++; // keep track of how many letters the song has
      } else { // if space, put " "
        guessList.push(" ");
      }
    }
    this.guessList = guessList;

    // Set the number of guesses to twice the number of letters
    this.numGuesses = lettersTotal ;

    // Set the original list of letters guessed to empty
    this.lettersGuessed = [];

    // Trigger to start a new game
    this.gameOver = false;

    // Reset the display for a new game
    this.printStats();
  }

  // Update the user guess list with the incoming letter
  this.updateGuess = function(letter) {
    // Variable keeping track of whether or not a letter appears in the word
    var inWord = false;

    // Check if the given letter has already been guessed
    if (this.lettersGuessed.indexOf(letter) !== -1) {
      // Letter has already been guessed, do nothing
      console.log("Letter has already been guessed!");
      return
    } else {
      // Letter has not been guessed
      this.lettersGuessed.push(letter);

      // Check if the letter appears in the word
      for (var i = 0; i < this.songList.length; i++) {
        if (this.songList[i] === letter) { // if it matches, record it
            this.guessList[i] = letter;
            inWord = true;
        }
      }

      // Letter is not in the word, decrement the number of guesses
      if (!inWord) {
        this.numGuesses --;
      }
    }
  }

  // Format a given list in order to display it nicely in HTML
  this.printList = function(list) {
    var myList = "";

    for (var i = 0; i < list.length; i++) {
      if (list[i] !== " ") { // if not a space, insert the character
        myList += list[i];
        myList += " "; // add space so several _ characters do not look like a line
      } else { // if space, put | to separate the words
        myList += "| ";
      }
    }

    return myList
  }

  // Print the game stats such as letters guessed and win/loss numbers
  this.printStats = function() {
    $("#userGuess").html(this.printList(this.guessList));
    $("#lettersGuessed").html(this.printList(this.lettersGuessed));
    $("#triesLeft").html(this.numGuesses);
    $("#totalWins").html(this.totalWins);
    $("#totalLosses").html(this.totalLosses);
  }

  // Check if the user has won or lost
  this.checkWin = function() {
    if (arraysEqual(this.guessList, this.songList) && (this.numGuesses >= 0)) {
      // User has won the game
      $("#userWinMessage").html("<strong>You have guessed " + this.guessList.join('') + " correctly!<strong>");
      this.totalWins ++;
      this.gameOver = true;
    } else if (!arraysEqual(this.guessList, this.songList) && (this.numGuesses <= 0)) {
      // User has lost the game
      $("#userLossMessage").html("<strong>You did not guess " + this.songList.join('') + "!<strong>");
      this.totalLosses ++;
      this.gameOver = true;
    } else {
      // Game continues
      console.log("User is still in the game...");
    }
  }
}

// Run Javascript when the HTML has finished loading
$(document).ready(function() {

  // Add the taylor theme song
  var audioElement = document.createElement("audio");
  audioElement.setAttribute("src", "./assets/22.mp3");

  // Theme Button
  $(".themeButton").on("click", function() {
    audioElement.play();
  });

  $(".pauseButton").on("click", function() {
    audioElement.pause();
  });

  // Store all of the taylor songs in a variable
  var allTaylorSongs = [
    "Blank Space",
    "Shake It Off",
    "You Belong With Me",
    "Bad Blood",
    "Love Story",
    "Look What You Made Me",
    "We Are Never Ever Getting Back Together",
    "I Knew You Were Trouble",
    "All Too Well",
    "Our Song"
  ];

  // Create the Hangman game object
  var hangman = new Game(allTaylorSongs);

  // Initialize a new game
  hangman.setupNewGame();

  // Listen for keyboard events
  $(document).keypress(function(evn) {
    // Record the letter pressed on the keyboard
    var letter = evn.key.toLowerCase();

    // Update the user guess
    hangman.updateGuess(letter);

    // Check if the user has won or lost
    hangman.checkWin();

    // Update the game display
    hangman.printStats();

    // Check if the game should be restarted at this time
    if (hangman.gameOver == true) {
      $("#taylorImage").attr("src", "./assets/images/" + hangman.songLink + ".jpg");
      hangman.setupNewGame();
    }
  }); // user keyboard press

}); // main routine
