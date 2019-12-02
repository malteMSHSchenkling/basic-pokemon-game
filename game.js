class Playground {
  constructor (width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    document.getElementById("playground").appendChild(this.canvas);
  }
}

class PokemonPlayground extends Playground {
  constructor (width, height) {
    super(width, height)
    this.updateGamesBoard();
  }

  updatePlayground () {
    //this.clearCanvas();
    console.log("in here");
  }
}
//+ instance
//draw method

//Rectangle

//Player extends Rectangle
//+ onKeyPress

//Vine extends Rectangle

//Bird extends Rectangle

//MovingCircles

window.onload = function() {
  let canvas;
  document.getElementById("startBtn").onclick = function() {      
    startGame();
    document.getElementById("startBtn").disabled = true; //inactivate button after first time use
  };
  
  function startGame() {
    let maxDisplayWidth = screen.width;
    let maxDisplayHeight = screen.height;
    let myPokemonPlayground = new PokemonPlayground(maxDisplayWidth, maxDisplayHeight/5*4); //change dimensions ?!
    
  }
};

