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
    this.maxDisplayWidth = screen.width * 0.8; //1536
    this.maxDisplayHeight = screen.height * 0.8; //960
    this.groundHeight = this.maxDisplayHeight * 0.9; //864
    this.cloudHeight = this.maxDisplayHeight * 0.1; //96
    //player-size variables
    this.playerSize = this.maxDisplayWidth * 0.05; //symetric by intend: 76,7
    //circle size valiables
    this.radius = this.maxDisplayWidth * 0.06; //92
    this.leftMovingCircleSpeedX = -1.1;
    this.rightMovingCircleSpeedX = 1;
    this.leftMovingCircleSpeedY = 1;
    this.rightMovingCircleSpeedY = 1.1;
    //bird-size variables
    this.birdSize = this.maxDisplayWidth * 0.04; //61
    //console.log(this.birdSize);
    //create class instances
    this.circleArr = [];
    this.myPlayer = new Player((this.maxDisplayWidth / 2) - (this.playerSize / 2), (this.maxDisplayHeight * 0.9) - this.playerSize, this.playerSize, this.playerSize, "orange", this.ctx);
    this.circleArr.push(new MovingCircles(0, (this.maxDisplayWidth / 2 - this.radius) - 1, this.cloudHeight + this.radius, this.radius, "red", 0, this.maxDisplayWidth, this.cloudHeight, this.groundHeight, this.leftMovingCircleSpeedX, this.leftMovingCircleSpeedY, this.ctx));
    this.circleArr.push(new MovingCircles(1, (this.maxDisplayWidth / 2 + this.radius) + 1, this.cloudHeight + this.radius, this.radius, "red", 0, this.maxDisplayWidth, this.cloudHeight, this.groundHeight, this.rightMovingCircleSpeedX, this.rightMovingCircleSpeedY, this.ctx));
    this.myBird = new Bird((this.maxDisplayWidth), (this.cloudHeight / 2) - (this.birdSize / 2), this.birdSize, this.birdSize, "grey", this.ctx, this.maxDisplayWidth);
    this.frames = 0; //Frames also operate for points atm - there will be a separate calculation which involves frames
    this.updatePlayground = this.updatePlayground.bind(this); //fix from Patrick
    this.interval = setInterval(this.updatePlayground, 10); //10ms Playground refresh
  }
  //empties the entire canvas
  clearPlayground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  //re-draws the entire canvas
  updatePlayground() {
    this.clearPlayground(); //console.log("cleared");
    //ground    
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, this.maxDisplayHeight * 0.9, this.maxDisplayWidth, this.maxDisplayHeight);
    //re-draw player
    this.myPlayer.update();
    //re-draw circles
    for (let i in this.circleArr) {
      //check for circle to circle collision
      if (i < this.circleArr.length - 1) { //loop to the second last position - compare current to next circle in array
        let circleToCircleCollisionStatus = false;
        circleToCircleCollisionStatus = getCollisionStatusCC(this.circleArr[i].x,
          this.circleArr[i].y,
          this.circleArr[Number(i) + 1].x,
          this.circleArr[Number(i) + 1].y,
          (this.circleArr[i].radius + this.circleArr[Number(i) + 1].radius));
        if (circleToCircleCollisionStatus === true) {
          this.circleArr[i].speedX *= -1;
          this.circleArr[Number(i) + 1].speedX *= -1;
        }
      }
      //check circle to player collision (add later a life count decrease)
      let circleToPlayerCollisionStatus = false;
      circleToPlayerCollisionStatus = getCollisionStatusPC(this.circleArr[i].x,
        this.circleArr[i].y,
        this.myPlayer.x,
        this.myPlayer.y,
        this.myPlayer.width,
        this.circleArr[i].radius);
      if (circleToPlayerCollisionStatus === true) {
        this.circleArr[i].speedY *= -1;
      }
      this.circleArr[i].update();
      this.ctx.fillStyle = "black";
      this.ctx.moveTo(Math.floor(this.circleArr[i].x), Math.floor(this.circleArr[i].y));
      this.ctx.lineTo(Math.floor(this.myPlayer.x), Math.floor(this.myPlayer.y));
      this.ctx.moveTo(Math.floor(this.circleArr[i].x), Math.floor(this.circleArr[i].y));
      this.ctx.lineTo(Math.floor(this.myPlayer.x + this.myPlayer.width), Math.floor(this.myPlayer.y));
      this.ctx.stroke();
    }
    //re-draw bird
    this.myBird.update();
  }
}

class Rectangle {
  constructor(x, y, width, height, color, maxDisplayWidth) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.maxDisplayWidth = maxDisplayWidth;
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
            this.speedXPlayer -= 1;
          }
          break;
        case 39:
          if (this.speedXPlayer === 0) { //allows only for constant direction change without exponential effect
            this.speedXPlayer += 1;
          }
          break;
        default:
      }
    };
    document.onkeyup = event => {
      this.speedXPlayer = 0;
    };
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
class Bird extends Rectangle {
  constructor(x, y, width, height, color, ctx, maxDisplayWidth) {
    super(x, y, width, height, color);
    this.ctx = ctx;
    this.speedXBird = -2;
    this.maxDisplayWidth = maxDisplayWidth;
  }
  update() {
    //add Variables
    //include movement in case of no collision
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    let leftBorder = 1;
    let rightBorder = this.maxDisplayWidth; //incl car width 80
    //checks if the bird is within the boundaries of the street and repositions the car by few px if its overextending
    if ((this.x + this.width + 1) > leftBorder) {
      this.x += this.speedXBird;
    } else {
      this.x = rightBorder; // bird starts to fly from the right side as long it is not hit
    }
  }
}

class MovingCircles {
  constructor(
    id,
    x,
    y,
    radius,
    color,
    borderLeft,
    borderRight,
    borderTop,
    borderBottom,
    directionX,
    directionY,
    ctx
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.borderLeft = borderLeft;
    this.borderRight = borderRight;
    this.borderTop = borderTop;
    this.borderBottom = borderBottom;
    this.directionX = directionX;
    this.directionY = directionY;
    this.ctx = ctx;
    this.speedX = 1 * this.directionX;
    this.speedY = 1.5 * this.directionY;
  }
  update() {
    //bouncing off borders
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x + this.radius >= this.borderRight) {
      this.speedX *= -1;
    }
    if (this.x - this.radius <= this.borderLeft) {
      this.speedX *= -1;
    }
    if (this.y + this.radius >= this.borderBottom) {
      this.speedY *= -1;
    }
    if (this.y - this.radius <= this.borderTop) {
      this.speedY *= -1;
    }
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
function getCollisionStatusCC(
  objectA_x,
  objectA_y,
  objectB_x,
  objectB_y,
  referenceDistance
) {
  let distance = Math.sqrt(
    Math.pow(objectA_x - objectB_x, 2) + Math.pow(objectA_y - objectB_y, 2)
  );
  if (distance <= referenceDistance) {
    return true;
  } else {
    return false;
  }
}
function getCollisionStatusPC(
  objectA_x,
  objectA_y,
  objectB_x,
  objectB_y,
  objectB_width,
  referenceDistance
) {
  let distance = 0;
  let tempDistanceLeft = (Math.sqrt(Math.pow((objectB_x - objectA_x), 2) + Math.pow((objectB_y - objectA_y), 2)));
  let tempDistanceRight = (Math.sqrt(Math.pow((objectB_x - objectA_x + objectB_width), 2) + Math.pow((objectB_y - objectA_y), 2))); //yet not jump capable
  if (tempDistanceLeft <= tempDistanceRight) {
    distance = Math.round(tempDistanceLeft);
  } else {
    distance = tempDistanceRight;
  }
  if (distance <= referenceDistance) {
    return true;
  } else {
    return false;
  }
}

window.onload = function () {
  document.getElementById("startBtn").onclick = function () {
    startGame();
    document.getElementById("startBtn").disabled = true; //inactivate button after first time use
  };

  function startGame() {
    let maxDisplayWidth = screen.width;
    let maxDisplayHeight = screen.height;
    let myPokemonPlayground = new PokemonPlayground(maxDisplayWidth * 0.8, maxDisplayHeight * 0.8); //nice to have: add check for different resolutions
  }
};
