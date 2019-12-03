class Playground {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        document.getElementById("playground").appendChild(this.canvas);
    }
}

class PokemonPlayground extends Playground {
    constructor(width, height) {
        super(width, height)
            //screen dimension variables 
        this.maxDisplayWidth = (screen.width * 0.8) /*- 1*/ ;
        this.maxDisplayHeight = screen.height * 0.8;
        //console.log(this.maxDisplayWidth); //1534
        //console.log(this.maxDisplayHeight); //960

        //player-size variables
        this.playerSize = this.maxDisplayWidth * 0.05; //symetric by intend
        //console.log(this.playerSize); //76,7


        //create class instances
        this.myPlayer = new Player((this.maxDisplayWidth / 2) - (this.playerSize / 2), (this.maxDisplayHeight * 0.9) - this.playerSize, this.playerSize, this.playerSize, "orange", this.ctx);

        this.frames = 0; //Frames also operate for points atm - there will be a separate calculation which involves frames
        this.updatePlayground = this.updatePlayground.bind(this); //fix from Patrick
        this.interval = setInterval(this.updatePlayground, 30); //30ms Playground refresh
    }

    //empties the entire canvas
    clearPlayground() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //re-draws the entire canvas
    updatePlayground() {
        this.clearPlayground();
        //ground    
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, this.maxDisplayHeight * 0.9, this.maxDisplayWidth, this.maxDisplayHeight);
        //console.log(this.maxDisplayHeight - this.maxDisplayHeight*0.9);//96

        //re-draw player
        this.myPlayer.update();
    }
}


class Rectangle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

class Player extends Rectangle {
    constructor(x, y, width, height, color, ctx) {
        super(x, y, width, height, color);
        this.ctx = ctx;
        this.speedXPlayer = 0;

        document.onkeydown = event => {
            switch (event.keyCode) {
                case 37:
                    if (this.speedXPlayer === 0) { //allows only for constant direction change without exponential effect
                        this.speedXPlayer -= 3;
                    }
                    break;
                case 39:
                    if (this.speedXPlayer === 0) { //allows only for constant direction change without exponential effect
                        this.speedXPlayer += 3;
                    }
                    break;
                default:
            }
        }
        document.onkeyup = event => {
            this.speedXPlayer = 0;
        }
    }

    update() {
        //add borderVariables

        //add borderCollisionCheck (full stop)
        //include movement in case of no collision

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        let leftBorder = 1;
        let rightBorder = 1460 //incl car width 80

        //checks if the car is within the boundaries of the street and repositions the car by few px if its overextending
        if (this.x > leftBorder) {
            this.x += this.speedXPlayer;
        } else {
            this.x = leftBorder; //reposition car on playground
        }
        if (this.x < rightBorder) {
            this.x += this.speedXPlayer;
        } else {
            this.x = rightBorder; //reposition car on playground
        }

    }
}

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
        let myPokemonPlayground = new PokemonPlayground(maxDisplayWidth * 0.8, maxDisplayHeight * 0.8); //nice to have: add check for different resolutions
        //console.log(maxDisplayWidth*0.8); //1536
        //console.log(maxDisplayHeight*0.8); //960
    }
};