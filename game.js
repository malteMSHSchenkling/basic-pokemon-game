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

    this.frames = 0; //Frames also operate for points atm - there will be a separate calculation which involves frames
    this.updatePlayground = this.updatePlayground.bind(this); //fix from Patrick
    this.interval = setInterval(this.updatePlayground, 30); //30ms Playground refresh

    this.maxDisplayWidth = screen.width*0.8;
    this.maxDisplayHeight = screen.height*0.8;
    //console.log(maxDisplayWidth);
    //console.log(maxDisplayHeight);
    
  }
  
  //empties the entire canvas
  clearPlayground () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  //re-draws the entire canvas
  updatePlayground () {
    this.clearPlayground ();    
    //this.ctx.fillRect(this.maxDisplayWidth-51, this.maxDisplayHeight-51, 50, 50);

  }
}


/*class Rectangle {
  constructor () {

  }
}*/

//Player extends Rectangle
//+ onKeyPress

//Vine extends Rectangle

//Bird extends Rectangle

//MovingCircles

window.onload = function() {
  document.getElementById("startBtn").onclick = function() {      
    startGame();
    document.getElementById("startBtn").disabled = true; //inactivate button after first time use
  };
  
  function startGame() {
    let maxDisplayWidth = screen.width;
    let maxDisplayHeight = screen.height;
    let myPokemonPlayground = new PokemonPlayground(maxDisplayWidth*0.8, maxDisplayHeight*0.8); //nice to have: add check for different resolutions
    //console.log(maxDisplayWidth*0.8); //1536
    //console.log(maxDisplayHeight*0.8); //960
  }
};

