//une fois le DOM chargé
window.onload = function () {
    var ctx;
    var delay = 100;                          // chaque 100 millièmes de seconde
    var canvasWidth = 900;
    var canvasHeight = 500;

    var blockSize = 20;
    var snakee = [];
    var colorSnakee = "";
    var direction;
    var score = 0;
    //var score;  //string test
    var game;
    var snakeeX, snakeeY;
    var snakeeEvolution = "";
    //si canvas w et h changent -> s'adapte
    var canvasFoodWidth = (canvasWidth / blockSize) - 1;
    var canvasFoodHeight = (canvasHeight / blockSize) - 1;
    /*
* START au départ du jeu
* bouton PAUSE ou event(space  == 32?)
*
* gameOver() renvoie la page avec nom et tous les scores
*
* */
    var sec = 0;
    var min = 0;
    var msec = 0;


    var foodPosition = {

        x: Math.floor(Math.random() * 44) * blockSize,
        y: Math.floor(Math.random() * 24) * blockSize
    };

    /* ** CREATING IMAGE FOR FOOD ** */
    var foodImg = new Image();
    foodImg.src = "img/foodImg.jpeg";
    foodImg.width = 20;
    foodImg.height = 20;

    /* ** START POSITION ** */
    snakee[0] = {x: 10 * blockSize, y: 15 * blockSize};

    /* ** LISTENING EVENT FOR SNAKEE'S DIRECTION ** */
    var event = document.addEventListener("keydown", directionSnake);


    init();
    refreshCanvas();


    /* ** CREATING CANVAS ** */
    function init() {

        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid #58a06e";
        canvas.style.margin = "0px 120px 27px 272px";
        canvas.style.backgroundColor = "#81c799";

        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
    }

    function draw() {

        snake();

    }


    /* ** SET INTERVAL ** */
    function refreshCanvas() {

        game = setInterval(draw, delay);

    }


    /* ** LEAD THE SNAKE ** */
    function directionSnake(event) {

        //à faire switch
        var key = event.keyCode;

        if (key == 37 && direction != "right") {
            direction = "left";
        } else if (key == 38 && direction != "down") {
            direction = "up";
        } else if (key == 39 && direction != "left") {
            direction = "right";
        } else if (key == 40 && direction != "up") {
            direction = "down";
        }

    }

    /* ** DRAW THE SNAKE ** */
    function snake() {
        //supprimer les frames
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Affichage score 0 par défaut
        if (score == 0) {
            document.getElementById("score").innerHTML = "Score : 0 ";

            snakeeEvolution = "Baby Snakee!";
            document.getElementById("evolution").innerHTML = "Growth : " + snakeeEvolution;
        }

        for (var i = 0; i < snakee.length; i++) {

            // changing Snakee's body colour
            if (score < 5) {
                colorSnakee = "#FFFF00";
            }
            if (score >= 2 && score < 20) {
                colorSnakee = "#fff";
            }
            if (score > 20 && score <= 35) {
                colorSnakee = "#fa8072";
            }
            // /!\ fillRect avant sinon ne prend pas la couleur en compte
            ctx.fillStyle = colorSnakee;
            ctx.fillRect(snakee[i].x, snakee[i].y, blockSize, blockSize);

            ctx.strokeStyle = colorSnakee;
            ctx.strokeRect(snakee[i].x, snakee[i].y, blockSize, blockSize);
        } //endfor


        ctx.drawImage(foodImg, foodPosition.x, foodPosition.y);

        //sauver 1ere position -> slice()
        snakeeX = snakee[0].x;
        snakeeY = snakee[0].y;


        /* ** TEST EAT FOOD ** */
        if (snakeeX == foodPosition.x && snakeeY == foodPosition.y) {
            score++;
            //si pomme position est dans le snake
            for(var i = 0; i < snakee.length; i++){
                if(snakee[i].x == foodPosition.x || snakee[i].y == foodPosition.y){
                    foodPosition = {
                        x: Math.floor(Math.random() * 44) * blockSize,
                        y: Math.floor(Math.random() * 24) * blockSize
                    };
                }
            }

            //nouveau random sur foodPosition
            foodPosition = {
                x: Math.floor(Math.random() * 44) * blockSize,
                y: Math.floor(Math.random() * 24) * blockSize
            };
            //console.log(foodPosition.x, foodPosition.y);

            /* DISPLAY TEST FOR FOOD */
            document.getElementById("score").innerHTML = "Score : " + score + "apple eaten...";

            if (score > 1) {
                document.getElementById("score").innerHTML = "Score : " + score + " apples eaten!";
            }

            if (score >= 20) {
                document.getElementById("score").innerHTML = "Score : " + score + " apples eaten!";
                snakeeEvolution = "Snakee child";
                document.getElementById("evolution").innerHTML = "Growth : " + snakeeEvolution;
                document.getElementById("message").innerHTML = "Great!! Let's growing up Snakee...";
            }
            if (score >= 35) {
                snakeeEvolution = "Sayian Snakee!";
                document.getElementById("evolution").innerHTML = "Growth : " + snakeeEvolution;

            }

            ctx.drawImage(foodImg, foodPosition.x, foodPosition.y);

        } else {

            snakee.pop();
        }


        //console.log(snakee[0]);
        /* ** TEST EVENT DIRECTION ** */
        if (direction == "left") {
            snakeeX -= blockSize;
        }
        if (direction == "right") {
            snakeeX += blockSize;

        }
        if (direction == "down") {
            snakeeY += blockSize;
        }
        if (direction == "up") {
            snakeeY -= blockSize;
        }


        /* ** UPDATE NEW HEAD POSITION ** */
        var newHead = {
            x: snakeeX,
            y: snakeeY
        };

        /* ** PUSH AT FIRST ELEMENT TAB ** */
        snakee.unshift(newHead);


        /* ** BORDERS COLLISION ** */
        if ((snakeeX >= canvasWidth) || (snakeeX < 0) || (snakeeY >= canvasHeight) || (snakeeY < 0)) {
            console.log("bordures!");

            stopGame();
        } else if (autoKill(newHead.x, newHead.y, snakee)) {
            console.log("autokill!");
            stopGame();
        }

    }//end snake

    /* ** SNAKEE'S BODY COLLISION ** */
    function autoKill(x, y, array) {
        //MONI!!! i à 1 pas à 0 sinon il s auto kill d office!!!!!!!!
        for (var i = 1; i < array.length; i++) {
            if (x === array[i].x && y === array[i].y) {
                return true;
            }

        }
        return false;
    }

    // 1000 msec = 1 sec
    function chronoTime() {

        msec = msec + delay;

        if (msec >= 1000) {
            sec++;
            msec = 0;
        }
        if (sec >= 60) {
            min++;
            sec = 0;
        }

        document.getElementById("chrono").hinnerHtml = min + ":" + sec + ":" + msec;
        // timerID = setTimeout("chronoTime()", 10);

    }


    function stopGame() {
        clearInterval(game);

    }


}// end onLoad()