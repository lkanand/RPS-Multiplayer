 var config = {
    apiKey: "AIzaSyBANG8TYyd144m-1Z06lEw7CG36lr5f3kU",
    authDomain: "rock-paper-scissors-9c357.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-9c357.firebaseio.com",
    projectId: "rock-paper-scissors-9c357",
    storageBucket: "rock-paper-scissors-9c357.appspot.com",
    messagingSenderId: "961582757790"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  var playerone = {
    choice: "",
    losses: 0,
    name: "",
    wins: 0
  };

  var playertwo = {
    choice: "",
    losses: 0,
    name: "",
    wins: 0
  };

  var enteredName = 0;
  var playerID = "";
  var playerOneExists = 0;
  var playerTwoExists = 0;
  var gameWinner = "";
  var games = 1;

  $("#submit-name").on("click", function(event){
    event.preventDefault();
    var isConnected;
    if(enteredName === 0) {
      var name = $("#player-name").val().trim();
      if(playerOneExists === 1 && playerTwoExists === 1) {
        alert("Sorry, there are already two players.");
      }
      else if(playerOneExists === 0) {
        isConnected = database.ref("players/playerone");
        $("#playerone").text(name);
        $("#playerone-statistics").removeClass("opacity-zero");
        $("#playerone-wins").text(playerone.wins);
        $("#playerone-losses").text(playerone.losses);
        enteredName = 1;
        playerOneExists = 1;
        playerID = "playerone";
        database.ref("players/playerone").set({
          name: name,
          losses: playerone.losses,
          wins: playerone.wins
        });
        isConnected.onDisconnect().remove();
      }
      else {
        isConnected = database.ref("players/playertwo");
        enteredName = 1;
        playerTwoExists = 1;
        playerID = "playertwo";
        $("#playertwo").text(name);
        $("#playertwo-statistics").removeClass("opacity-zero");
        $("#playerone-wins").text(playerone.wins);
        $("#playerone-losses").text(playerone.losses);
        database.ref("players/playertwo").set({
          name: name,
          losses: playertwo.losses,
          wins: playertwo.wins
        });
        isConnected.onDisconnect().remove();
      }
    }
    $("#player-name").val("");
  }); 

database.ref("/players").on("value", function(snapshot){
  if(snapshot.hasChild("playerone")) {
    playerOneExists = 1;
    playerone.name = snapshot.val().playerone.name;
    playerone.losses = parseInt(snapshot.val().playerone.losses);
    playerone.wins = parseInt(snapshot.val().playerone.wins);
    playerone.choice = snapshot.val().playerone.choice;
    $("#playerone-wins").text(playerone.wins);
    $("#playerone-losses").text(playerone.losses);
    $("#playerone-statistics").removeClass("opacity-zero");
    $("#playerone").text(playerone.name);
  }

  if(snapshot.hasChild("playertwo")) {
    playerTwoExists = 1;
    playertwo.name = snapshot.val().playertwo.name;
    playertwo.losses = parseInt(snapshot.val().playertwo.losses);
    playertwo.wins = parseInt(snapshot.val().playertwo.wins);
    playertwo.choice = snapshot.val().playertwo.choice;
    $("#playertwo-wins").text(playertwo.wins);
    $("#playertwo-losses").text(playertwo.losses);
    $("#playertwo-statistics").removeClass("opacity-zero");
    $("#playertwo").text(playertwo.name);
  }
}, function(errorObject){
  console.log("The read failed: " + errorObject.code);
});

database.ref("/players").on("child_removed", function(snapshot){
    if(snapshot.key === "playertwo") {
      playerTwoExists = 0;
      $("#playertwo-losses").empty();
      $("#playertwo-wins").empty();
      $("#playertwo").text("Waiting...");
      $("#playertwo-statistics").addClass("opacity-zero");
      $("#options-one").addClass("opacity-zero");
      playertwo.losses = 0;
      playertwo.wins = 0;
      playertwo.name = "";
      playerone.choice = "";
      database.ref("players/playerone").update({
        "choice": null
      });
    }
    else {
      playerOneExists = 0;
      $("#playerone-losses").empty();
      $("#playerone-wins").empty();
      $("#playerone").text("Waiting...");
      $("#playerone-statistics").addClass("opacity-zero");
      $("#options-one").addClass("opacity-zero");
      playerone.losses = 0;
      playerone.wins = 0;
      playerone.name = "";
      playertwo.choice = "";
      database.ref("players/playertwo").update({
        "choice": null
      });
    }
    $(".option-one").unbind("click");
    $(".option-two").unbind("click");
    $("#chat").empty();
    database.ref().child("messages").remove();
    database.ref().child("gameWinner").remove();
    database.ref().child("games").remove();
    games = 1;
});

database.ref("/players").on("child_added", function(snapshot){
  if((snapshot.key === "playerone" && playerTwoExists === 1) || (snapshot.key === "playertwo" && playerOneExists === 1))
    startRPSOne(); 
});

database.ref("players/playerone").on("child_added", function(snapshot){
  if(playerone.choice !== "") {
    startRPSTwo();
  }
});

database.ref("players/playertwo").on("child_added", function(snapshot){
  if(playertwo.choice !== "") {
    evaluateResult();
  }
});

database.ref("players/playertwo").on("child_removed", function(snapshot){
  playerone.choice = "";
  playertwo.choice = "";
  startRPSOne();
});

database.ref("/gameWinner").on("value", function(snapshot){
  if(playerone.name !== "" && playertwo.name !== "") {
    gameWinner = snapshot.val();
  }
});

database.ref("/games").on("value", function(snapshot){
  if(playerone.name !== "" && playertwo.name !== "") {
    games = parseInt(snapshot.val());
    $("#winner").text(gameWinner + " wins");
    setTimeout(function(){
      $("#winner").empty();
    }, 2000);
  }
});

function startRPSOne(){
  if(playerID === "playerone") {
    $("#options-one").removeClass("opacity-zero");
    $(".option-one").on("click", function(){
      $(".option-one").unbind("click");
      playerone.choice = $(this).text();
      database.ref("players/playerone").update({
        choice: playerone.choice
      });
    });
  }
}

function startRPSTwo(){
  if(playerID === "playerone")
    $("#options-one").addClass("opacity-zero");
  else if(playerID === "playertwo") {
    $("#options-two").removeClass("opacity-zero");
    $(".option-two").on("click", function(){
      $(".option-two").unbind("click");
      $("#options-two").addClass("opacity-zero");
      playertwo.choice = $(this).text();
      database.ref("players/playertwo").update({
        choice: playertwo.choice
      });
    });
  }
}

function evaluateResult(){
  if(playerID === "playertwo") {
    if(playerone.choice === "Rock" && playertwo.choice === "Scissors") {
      playerone.wins++;
      playertwo.losses++;
      gameWinner = playerone.name;
    }
    else if(playerone.choice === "Rock" && playertwo.choice === "Paper") {
      playerone.losses++;
      playertwo.wins++;
      gameWinner = playertwo.name;
    }
    else if(playerone.choice === "Paper" && playertwo.choice === "Rock") {
      playerone.wins++;
      playertwo.losses++;
      gameWinner = playerone.name;
    }
    else if(playerone.choice === "Paper" && playertwo.choice === "Scissors") {
      playerone.losses++;
      playertwo.wins++;
      gameWinner = playertwo.name;
    }
    else if(playerone.choice === "Scissors" && playertwo.choice === "Paper") {
      playerone.wins++;
      playertwo.losses++;
      gameWinner = playerone.name;
    }
    else if(playerone.choice === "Scissors" && playertwo.choice === "Rock") {
      playerone.losses++;
      playertwo.wins++;
      gameWinner = playertwo.name;
    }

    database.ref("/players").update({
      "playerone/wins": playerone.wins,
      "playerone/losses": playerone.losses,
      "playertwo/wins": playertwo.wins,
      "playertwo/losses": playertwo.losses
    });

    if(playerone.choice === playertwo.choice)
      gameWinner = "Nobody";

    database.ref().update({
      gameWinner: gameWinner,
      games: games++
    });

    database.ref("/players").update({
      "playerone/choice": null,
      "playertwo/choice": null
    });
  }
}

$("#submit-message").on("click", function() {
  event.preventDefault();
  if(playerID === "")
    alert("Must be an active player to send chat message");
  else if(playerOneExists === 0 || playerTwoExists === 0)
    alert("Must have an opponent to send chat message");
  else {
    var text = $("#message").val().trim();
    database.ref("/messages").push({
      text: text,
      id: playerID,
      time: firebase.database.ServerValue.TIMESTAMP
    })
  }
  $("#message").val("");
});

database.ref("/messages").orderByChild("time").limitToLast(1).on("child_added", function(snapshot){
  var p = $("<p>");
  var player = snapshot.val().id;
  var name;
  if(player === "playerone") {
    name = playerone.name;
    p.addClass("purple");
  }
  else {
    name = playertwo.name;
    p.addClass("blue");
  }
  var span = $("<span>").text(name + ": " + snapshot.val().text);
  p.append(span);
  $("#chat").append(p);
});