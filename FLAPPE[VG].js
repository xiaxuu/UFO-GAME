

//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//space shuttle
let ufoWidth = 34; //width/height ratio = 408/228 = 17/12
let ufoHeight = 24;
let ufoX = boardWidth/8;
let ufoY = boardHeight/2;
let ufoImg;

let ufo = {
    x : ufoX,
    y : ufoY,
    width : ufoWidth,
    height : ufoHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;     //width/height = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0;  //ufo jump speed
let gravity = 0.4; 

let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on board

    //draw flappy ufo here
    // context.fillStyle = "blue";
    // context.fillRect(ufo.x, ufo.y, ufo.width, ufo.height);

    //load images
    ufoImg = new Image();
    ufoImg.src = "./UFO1.png";
    ufoImg.onload = function() {
        context.drawImage(ufoImg, ufo.x, ufo.y, ufo.width, ufo.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveUfo);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;

    }
    context.clearRect(0, 0, board.width, board.height);

    //ufo
    velocityY += gravity;
    //ufo.y += velocityY;
    ufo.y = Math.max(ufo.y + velocityY, 0); //apply gravity to current ufo, limit the ufo.y to top of the canvas
    context.drawImage(ufoImg, ufo.x, ufo.y, ufo.width, ufo.height);

    if (ufo.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if (!pipe.passed && ufo.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 bcs there are 2 pipes! 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(ufo, pipe)) {
             gameOver = true;
        }

    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first elements from the array

    }
    
    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAMEOVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeheight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y: randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);

}

function moveUfo(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            ufo.y = ufoY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b){ 
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;

}