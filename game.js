//classes

//class Playground
//+ instance
//draw method

//Rectangle

//Player extends Rectangle
//+ onKeyPress

//Vine extends Rectangle

//Bird extends Rectangle

//MovingCircles

window.onload = function() {
    document.getElementById("startBtn").onclick = function() {
      if (document.getElementById("playground").getElementsByTagName("canvas").length < 1) {
        startGame();
        document.getElementById("startBtn").disabled = true; //inactivate button after first time use
      }
    };
  
    function startGame() {
      let myPlayground = new Playground(400, 600); //change dimensions !!!
    }
  };

