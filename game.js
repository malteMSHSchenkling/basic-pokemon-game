class Playground {
  constructor(width, height) {
    if (document.getElementById("playground").childElementCount > 0) {
      document.querySelector("canvas").remove();
    }
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    document.getElementById("playground").appendChild(this.canvas);
    this.playgroundImg  = new Image();
    this.playgroundImg.src = "./images/PokemonwWallpaper.png";
  }
}
class PokemonPlayground extends Playground {
  constructor(width, height) {
    super(width, height);
    //screen dimension variables
    this.maxDisplayWidth = screen.width * 0.8; //1536
    this.maxDisplayHeight = screen.height * 0.8; //960
    this.groundHeight = this.maxDisplayHeight * 0.9; //864
    this.cloudHeight = this.maxDisplayHeight * 0.1; //96
    //player-size variables
    this.playerCRadius = this.maxDisplayWidth * 0.03; //~ 76
    //circle size valiables
    this.radius = this.maxDisplayWidth * 0.06; //92
    this.leftMovingCircleSpeedX = -1.1;
    this.rightMovingCircleSpeedX = 1;
    this.leftMovingCircleSpeedY = 1;
    this.rightMovingCircleSpeedY = 1.1;
    //bird-size variables
    this.birdSize = this.maxDisplayWidth * 0.04; //61
    //vine variables
    this.helpLetAVineGrow = 0;
    //game variables //MS
    this.gameBonusPointsLifes = 600; //MS
    this.gameBonusPointsBirds = 25; //MS
    this.gameBirdsCatched = 0; //MS
    this.gameScore = 0; //tied to frames = time //MS
    this.gamePlayerLifes = 3; //MS
    this.gameMaxFrames = (60000*3); //60sec*5 //reference (60000*5) //MS
    //create class instances
    this.circleArr = [];
    this.myPlayerC = new PlayerC (
      (this.maxDisplayWidth / 2),
      (this.groundHeight - this.playerCRadius),
      this.playerCRadius,
      this.maxDisplayWidth,
      "orange",
      this.ctx
    );
    this.myVine = new Vine((this.myPlayerC.circleCenterX + this.myPlayerC.circleRadius), (this.groundHeight - 5), (this.groundHeight - 5), ((this.myPlayerC.circleRadius*2) / 5), 5, 5, "brown", this.myPlayerC.growSwitch, this.ctx);
    this.circleArr.push(
      new MovingCircles(
        0,
        (this.maxDisplayWidth / 2 - this.radius) - 1,
        this.cloudHeight + this.radius,
        this.radius,
        "red",
        0,
        this.maxDisplayWidth,
        this.cloudHeight,
        this.groundHeight,
        this.leftMovingCircleSpeedX,
        this.leftMovingCircleSpeedY,
        this.ctx
      )
    );
    this.circleArr.push(
      new MovingCircles(
        1,
        (this.maxDisplayWidth / 2 + this.radius) + 1,
        this.cloudHeight + this.radius,
        this.radius,
        "red",
        0,
        this.maxDisplayWidth,
        this.cloudHeight,
        this.groundHeight,
        this.rightMovingCircleSpeedX,
        this.rightMovingCircleSpeedY,
        this.ctx
      )
    );
    this.myBird = new Bird(
      (this.maxDisplayWidth),
      (this.cloudHeight / 2) - (this.birdSize / 2),
      this.birdSize,
      this.birdSize,
      "grey",
      this.ctx,
      this.maxDisplayWidth
    );
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
    this.clearPlayground();
    this.ctx.drawImage(this.playgroundImg, 0, 0, this.canvas.width, this.canvas.height);
    //ground
    //this.ctx.fillStyle = "green";
    /*this.ctx.fillRect(
      0,
      this.maxDisplayHeight * 0.9,
      this.maxDisplayWidth,
      this.maxDisplayHeight
    );*/
    //this.ctx.fillStyle = "lightblue";
    //this.ctx.fillRect(0, 0, this.maxDisplayWidth, this.cloudHeight);
    //re-draw vine
      if (this.myPlayerC.growSwitch === true) {
      if (this.helpLetAVineGrow === 0) {
        this.helpLetAVineGrow = 1;
        this.myVine.x = (this.myPlayerC.circleCenterX + this.myPlayerC.circleRadius);
        this.myVine.y = (this.groundHeight - 5);
        this.myVine.orgY = (this.groundHeight - 5);
        this.myVine.width = ((this.myPlayerC.circleRadius*2) / 5);
        this.myVine.height = 5;
        this.myVine.orgHeight = 5;
        this.myVine.color = "brown";
        this.myVine.ctx = this.ctx;
      }
      this.myVine.growSwitch = true;
      //collision check with bird
      let birdCollision = false;
      birdCollision = getCollisionStatusVB(
        this.myVine.x,
        this.myVine.y,
        this.myVine.width,
        this.myBird.x,
        this.myBird.y,
        this.myBird.width,
        this.myBird.height
      );  
      if (birdCollision === true) {
        //console.log("col");
        this.gameBirdsCatched++;
        this.myVine.growSwitch = false; //let vine disappear (prevention of multi collision)
      }
      this.myVine.update();
    }
    if (this.myVine.growSwitch === false) {
      this.myPlayerC.growSwitch = false;
      this.helpLetAVineGrow = 0;
    }
    //re-draw bird
    this.myBird.update();
    //re-draw player
    this.myPlayerC.update();
    //re-draw circles
    for (let i in this.circleArr) {
      //check for circle to circle collision
      if (i < this.circleArr.length - 1) {
        //loop to the second last position - compare current to next circle in array
        let circleToCircleCollisionStatus = false;
        circleToCircleCollisionStatus = getCollisionStatusCC(
          this.circleArr[i].x,
          this.circleArr[i].y,
          this.circleArr[Number(i) + 1].x,
          this.circleArr[Number(i) + 1].y,
          (this.circleArr[i].radius + this.circleArr[Number(i) + 1].radius)
        );
        let distanceY = (this.circleArr[i].y - this.circleArr[Number(i) + 1].y);
        let distance = Math.sqrt(
          Math.pow(this.circleArr[i].x - this.circleArr[Number(i) + 1].x, 2) + Math.pow(this.circleArr[i].y - this.circleArr[Number(i) + 1].y, 2)
        );
        let collisionArc = Math.abs(Math.sin(distanceY/distance)); //can reach max 180° so -1 to 1
        //console.log("dist: " + distance + " distY: " + distanceY + " deg: " + collisionArc);
        //console.log("coll CP");
        if (circleToCircleCollisionStatus === true) {
          if (collisionArc >= 0.5) {
            console.log("Y coll: " + collisionArc + " dist " + distance);
            this.circleArr[i].speedY *= -1;
            this.circleArr[Number(i) + 1].speedY *= -1;
          }
          else {
            console.log("X coll: " + collisionArc + " dist " + distance);
            this.circleArr[i].speedX *= -1;
            this.circleArr[Number(i) + 1].speedX *= -1;
          }
        }
      }
      let circleToPlayerCCollisionStatus = false;
      circleToPlayerCCollisionStatus = getCollisionStatusCC(
        this.circleArr[i].x,
        this.circleArr[i].y,
        this.myPlayerC.circleCenterX,
        this.myPlayerC.circleCenterY,
        (this.circleArr[i].radius + this.myPlayerC.circleRadius)
      );
      if (circleToPlayerCCollisionStatus === true) {
        //calc arc and decide to witch x or Y speeds
        let distanceY = (this.circleArr[i].y - this.myPlayerC.circleCenterY);
        let distance = Math.sqrt(
          Math.pow(this.circleArr[i].x - this.myPlayerC.circleCenterX, 2) + Math.pow(this.circleArr[i].y - this.myPlayerC.circleCenterY, 2)
        );
        let collisionArc = Math.abs(Math.sin(distanceY/distance)); //can reach max 180° so -1 to 1
        //console.log("dist: " + distance + " distY: " + distanceY + " deg: " + collisionArc);
        //console.log("coll CP");
        if (collisionArc >= 0.5) {
          console.log("Y coll: " + collisionArc + " dist " + distance);
          this.circleArr[i].speedY *= -1;
        }
        else {
          console.log("X coll: " + collisionArc + " dist " + distance);
          this.circleArr[i].speedX *= -1;
        }
        this.gamePlayerLifes--;
      }
      //add circle to vine collision
      let circleToVineCollisionStatus;
      if (this.myVine.growSwitch === true) {
        circleToVineCollisionStatus = getCollisionStatusCV(
          this.circleArr[i].x,
          this.circleArr[i].y,
          this.myVine.x,
          this.myVine.y,
          this.myVine.width,
          this.circleArr[i].radius,
        );
        if (circleToVineCollisionStatus === "xrevert") {
          this.circleArr[i].speedX *= -1;
        }
        if (circleToVineCollisionStatus === "yrevert") {
          this.circleArr[i].speedY *= -1;
          this.circleArr[i].y -= 2;
        }
      }
      this.circleArr[i].update();
    }
    //html update calc
    this.frames += 10; //MS
    this.gameScore = (Math.round(this.frames/100) + (this.gameBonusPointsBirds * this.gameBirdsCatched));
    document.getElementById("currentTime").innerText = Math.round((this.gameMaxFrames/1000) - (this.frames/1000));
    document.getElementById("currentScore").innerText = this.gameScore;
    document.getElementById("catchedBirds").innerText = this.gameBirdsCatched;
    document.getElementById("currentLifes").innerText = this.gamePlayerLifes;
    //game over check //MS
    if (this.gamePlayerLifes <= 0) {
      //add full size picture "LOST" (scaled) - or write Text add interim
      this.ctx.drawImage(this.playgroundImg, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "darkred";
      this.ctx.font = "60px Arial";
      this.ctx.fillText("YOU've been smashed !!! Try again ...", (this.maxDisplayWidth/5)*1, (this.maxDisplayHeight/5)*2.6);
      clearInterval(this.interval); //stops canvas refesh
      document.getElementById("startBtn").disabled = false; //re-activate button upon game end
    }
    //win check
    if (this.frames >= this.gameMaxFrames) {
      this.frames = Math.floor(this.frames/10000)*10000;
      this.gameScore = (Math.round(this.frames/100) + ((this.gamePlayerLifes-1)*this.gameBonusPointsLifes) + (this.gameBonusPointsBirds * this.gameBirdsCatched));
      document.getElementById("currentTime").innerText = Math.round(this.frames/1000);
      document.getElementById("currentScore").innerText = this.gameScore; //due to gameScore recalc
      //add full size picture "WON" (scaled) - or write Text add interim
      this.ctx.drawImage(this.playgroundImg, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "green";
      this.ctx.font = "60px Arial";
      this.ctx.fillText("YOU've made it !!! EinsEins11", (this.maxDisplayWidth/5)*1.2, (this.maxDisplayHeight/5)*2.6);
      clearInterval(this.interval); //stops canvas refesh
      document.getElementById("startBtn").disabled = false; //re-activate button upon game end
    }
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

//circle base class to be introduced due to the player being now a circle too 
class PlayerC {
  constructor (circleCenterX, circleCenterY, circleRadius, rightBorderX, color, ctx) {
    this.circleCenterX = circleCenterX;
    this.circleCenterY = circleCenterY;
    this.circleRadius = circleRadius;
    this.rightBorderX = rightBorderX;
    this.color = color;
    this.ctx = ctx;
    this.speedXPlayer = 0;
    this.growSwitch = false;
    this.myPlayerImg  = new Image();
    this.myPlayerImg.src = "./images/pokemon.png";
    document.onkeydown = event => { //supports only one key hit at a time unfortunatelly
      switch (event.keyCode) {
        case 37:
          if (this.speedXPlayer === 0) {
          //allows only for constant direction change without exponential effect
            this.speedXPlayer -= 1;
          }
          break;
        case 39:
          if (this.speedXPlayer === 0) {
          //allows only for constant direction change without exponential effect
            this.speedXPlayer += 1;
          }
          break;
        case 32:
          this.growSwitch = true;
          break;
        default:
      }
    };
    document.onkeyup = event => {
      this.speedXPlayer = 0;
    };
  }
  update () {
    let leftBorder = 1;
    let rightBorder = this.rightBorderX;
    if ((this.circleCenterX - this.circleRadius) > leftBorder) { //circle is away form left border
      this.circleCenterX += this.speedXPlayer;
    } else {
      this.circleCenterX = (leftBorder + this.circleRadius); //reposition car on playground
    }
    if ((this.circleCenterX + this.circleRadius) < rightBorder) { //circle is away from right border
      this.circleCenterX += this.speedXPlayer;
    } else {
      this.circleCenterX = (rightBorder - this.circleRadius); //reposition car on playground
    }
    //this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.circleCenterX, this.circleCenterY, this.circleRadius, 0, Math.PI * 2);
    //this.ctx.fill();
    this.ctx.closePath();
    this.ctx.drawImage(this.myPlayerImg, (this.circleCenterX - this.circleRadius), (this.circleCenterY - this.circleRadius), (this.circleRadius*2), (this.circleRadius*2)); //correct coords
  }
}

//Vine extends Rectangle
class Vine extends Rectangle {
  constructor(x, y, orgY, width, height, orgHeight, color, growSwitch, ctx) {
    super(x, y, width, height, color);
    this.orgY = orgY;
    this.orgHeight = orgHeight;
    this.ctx = ctx;
    this.speedYVine = 0;
    this.growSwitch = growSwitch;
    //this.myVineImg  = new Image();
    //this.myVineImg.src = "./images/vine.png";
  }
  update() {
    //this.ctx.fillStyle = this.color;
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.growSwitch === true && this.y >= 0) {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
      //this.ctx.drawImage(this.myVineImg, 0, 0, 348, 877, this.x,this.y, this.width ,this.height);
      this.speedYVine = 3;
      this.y -= this.speedYVine;
      this.height += this.speedYVine;
    }
    else {
      this.y = this.orgY;
      this.height = this.orgHeight;
      this.speedYVine = 0;
      this.growSwitch = false;
    }
  }
}
//Bird extends Rectangle
class Bird extends Rectangle {
  constructor(x, y, width, height, color, ctx, maxDisplayWidth) {
    super(x, y, width, height, color);
    this.ctx = ctx;
    this.speedXBird = -2;
    this.maxDisplayWidth = maxDisplayWidth;
    this.myBirdImg  = new Image();
    this.myBirdImg.src = "./images/angry-birds-png-46171.png";
  }
  update() {
    //add Variables
    //include movement in case of no collision
    //this.ctx.fillStyle = this.color;
    //this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.drawImage(this.myBirdImg, this.x, this.y, this.width, this.height);

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
    this.myCircleImg  = new Image();
    this.myCircleImg.src = "./images/ball.png";
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
      this.y = this.borderTop + this.radius; //fix for pushing the button out of bounds (e.g. via vine)
    }
    //this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    //this.ctx.fill();
    this.ctx.closePath();
    this.ctx.drawImage(
      this.myCircleImg,
      this.x-this.radius-4,
      this.y-this.radius-6,
      (this.radius*2)+7,
      (this.radius*2)+9
    );
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

function getCollisionStatusCV(
  circleX,
  circleY,
  vineX,
  vineY,
  vineWidth,
  referenceDistance
) {
  let tempDistanceXLeft = 2000;
  let tempDistanceXRight = 2000;
  if (circleX <= vineX) {  //circle is left from vine
    tempDistanceXLeft = vineX - circleX;
  }
  else {
    tempDistanceXRight = circleX - vineX - vineWidth;
  }
  let distanceX = Math.floor(Math.min(tempDistanceXLeft, tempDistanceXRight));
  let vineTopCenterX = vineX + Math.floor((vineWidth/2)+1);
  let vineTopCenterY = vineY + Math.floor((vineWidth/2)+1);
  let vineTopCenterDistance = Math.sqrt(Math.pow(Math.floor((vineWidth/2)+1), 2) + Math.pow(Math.floor((vineWidth/2)+1), 2));
  let referenceDistanceX = referenceDistance;
  referenceDistance += vineTopCenterDistance; //add circle radius and top radius of vine
  let distanceTop = Math.sqrt(
      Math.pow(circleX - vineTopCenterX, 2) + Math.pow(circleY - vineTopCenterY, 2)
    );
  if ((distanceTop <= referenceDistance)) { //check top bounce off vine
    //console.log("Xleft: " + tempDistanceXLeft + " XRight: " + tempDistanceXRight + " distX: " + distanceX + " distRef " + referenceDistance);
    return "yrevert";
  }
  else if ((distanceX <= referenceDistanceX) && (vineY <= circleY)) { //check horizontal bounce only if vine is higher than circle (y)
    //console.log("Xleft: " + tempDistanceXLeft + " XRight: " + tempDistanceXRight + " distX: " + distanceX + " distRef " + referenceDistance);
    return "xrevert";
  }
  else {
    return "nothing";
  }
}

function getCollisionStatusVB(
  vineX,
  vineY,
  vineWidth,
  birdX,
  birdY,
  birdWidth,
  birdHeight
) {
  if ( (vineY >= (birdY + birdHeight)) && //vine top is eqal or higher than birds lower border
       (birdX <= (vineX + vineWidth)) &&  //birds left side is equal or more left than vines right border
       ((birdX + birdWidth) >= vineX) ) { //birds right side is equal or more right than vines left border
    //console.log("vine bird collision " + (vineY > (birdY + birdHeight)) + " " + (birdX <= (vineX + vineWidth)) + " " + ((birdX + birdWidth) >= vineX));
    return true;
  }
  else {
    return false;
  }
}

window.onload = function() {
  //TODO re-enable Start button upon gameWon, gameOver
  document.getElementById("startBtn").onclick = function() {
    startGame();
    document.getElementById("startBtn").disabled = true; //inactivate button after first time use
  };
  function startGame() {
    let maxDisplayWidth = screen.width;
    let maxDisplayHeight = screen.height;
    let myPokemonPlayground = new PokemonPlayground(
      maxDisplayWidth * 0.8,
      maxDisplayHeight * 0.8
    ); //nice to have: add check for different resolutions //check for reset of gameStatus's
  }
};
