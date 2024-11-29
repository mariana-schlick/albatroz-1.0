//tela
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// albatroz
let albatrozWidth = 34;
let albatrozHeight = 34;
let albatrozX = boardWidth/8;
let albatrozY = boardHeight/2;
let albatrozImg;

let albatroz = {
    x : albatrozX,
    y : albatrozY,
    width : albatrozWidth,
    height : albatrozHeight
}

// garrafas
let bottleArray = [];
let bottleWidth = 50;
let bottleHeight = 512;
let bottleX = boardWidth;
let bottleY = 0;

let topBottleImg;
let bottomBottleImg;

// física
let velocityX = -2; // velocidade das garrafas
let velocityY = 0; // movimento do pássaro
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // carregar imagens
    albatrozImg = new Image();
    albatrozImg.src = "./img/bird.png";
    albatrozImg.onload = function () {
        context.drawImage(albatrozImg, albatroz.x, albatroz.y, albatroz.width, albatroz.height);
    }

    topBottleImg = new Image();
    topBottleImg.src = "./img/bottle-down.png";

    bottomBottleImg = new Image();
    bottomBottleImg.src = "./img/bottle-up.png";

    requestAnimationFrame(update);
    setInterval(placeBottles, 1500); // a cada 1,5 segundos
    document.addEventListener("keydown", moveAlbatroz);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // pássaro
    velocityY += gravity;
    albatroz.y = Math.max(albatroz.y + velocityY, 0); //limitar o pássaro para não passar da dimensão da tela
    context.drawImage(albatrozImg, albatroz.x, albatroz.y, albatroz.width, albatroz.height);

    if (albatroz.y > board.height) {
        gameOver = true;
    }

    // garrafas
    for (let i = 0; i < bottleArray.length; i++) {
        let bottle = bottleArray[i];
        bottle.x += velocityX; // mover garrafa
        context.drawImage(bottle.img, bottle.x, bottle.y, bottle.width, bottle.height);

        if (!bottle.passed && albatroz.x > bottle.x + bottle.width) {
            score += 0.5;
            bottle.passed = true;
        }

        if (detectCollision(albatroz, bottle)) {
            gameOver = true;
        }
    }

        // remover garrafas que saíram da tela
        while (bottleArray.length > 0 && bottleArray[0].x < -bottleWidth) {
            bottleArray.shift();
        }

        //pontos
        context.fillStyle = "white";
        context.font="45px sans-serif";
        context.fillText(score, 5, 45);

        if (gameOver) {
            context.fillText("GAME OVER", 5, 90);
        }
    }

function placeBottles(){
    if (gameOver) {
            return;
    }

    let randomBottleY = bottleY - bottleHeight/4 - Math.random()*(bottleHeight/2);
    let openingSpace = board.height/4;

    let topBottle = {
        img : topBottleImg, 
        x : bottleX,
        y : randomBottleY,
        width : bottleWidth,
        height : bottleHeight,
        passed : false
    }
    bottleArray.push(topBottle);

    let bottomBottle = {
        img : bottomBottleImg,
        x : bottleX,
        y : randomBottleY + bottleHeight + openingSpace,
        width : bottleWidth,
        height : bottleHeight,
        passed : false
    }
    bottleArray.push(bottomBottle);
}

function moveAlbatroz(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //"pulo" pássaro
        velocityY = -6;

        //recomeçar jogo
        if (gameOver) {
            albatroz.y = albatrozY;
            bottleArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}