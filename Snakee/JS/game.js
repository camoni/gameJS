//une fois le DOM chargé
window.onload = function () {
    var ctx;
    var delay = 100;                          // chaque 100 millièmes de seconde
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 20;
    var snakee = [];
    var direction;
    var score = 0;
    var game;
    var snakeeX, snakeeY;


    //apples position
    var foodPosition = {

        x: Math.floor(Math.random() * 44 + 1) * blockSize,
        y: Math.floor(Math.random() * 29 + 1) * blockSize
    };

    //creating food

    let foodImg = new Image();
    foodImg.src = "img/foodImg.jpeg";
    foodImg.width = 20;
    foodImg.height = 20;

    //snakee position
    snakee[0] = {x: 10 * blockSize, y: 15 * blockSize };
    //snakee[1] = {x: 9 * blockSize, y: 15 * blockSize};


    //creating the event
    var event = document.addEventListener("keydown", directionSnake);


    init();
    refreshCanvas();


    //creating canvas
    function init() {

        // On crée le noeud
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        canvas.style.margin = "10% 15%";

        // On l'ajoute au dom
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');

    }

    function draw() {

        snake();
    }


    /* *************************************************** */
    function refreshCanvas() {


        game = setInterval(draw,delay);
    }


    function directionSnake(event) {

        //à faire switch
        var key = event.keyCode;

        if (key == 37 && direction != "right") {
            direction = "left";
        } else if (key == 38 && direction != "down") {
            direction = "up";
        }
        else if(key == 39 && direction != "left" ){
            direction = "right";
        }
        else if(key == 40 && direction != "up"){
            direction = "down";
        }

    }


    function snake() {
    //supprimer les frames
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);


    for(var i = 0; i < snakee.length; i++){

        //fillRect avant sinon ne prend pas la couleur en compte
        ctx.fillStyle = 'blue';
        ctx.fillRect(snakee[i].x, snakee[i].y, blockSize, blockSize);
        ctx.strokeStyle = '#40A497';
        ctx.strokeRect(snakee[i].x, snakee[i].y, blockSize, blockSize);

    } //endfor


        ctx.drawImage(foodImg,foodPosition.x,foodPosition.y);

        //sauver 1ere position -> slice()
         snakeeX = snakee[0].x;
         snakeeY = snakee[0].y;


        //MANGER UNE POMME -> si la tête x et y == position pomme x y
        if(snakeeX == foodPosition.x && snakeeY == foodPosition.y){
            score++;
            //nouveau random sur foodPosition
            foodPosition = {
                x: Math.floor(Math.random() * 44 + 1) * blockSize,
                y: Math.floor(Math.random() * 29 + 1) * blockSize
            };
            console.log(foodPosition.x, foodPosition.y);
            ctx.drawImage(foodImg,foodPosition.x,foodPosition.y);

        }
        else{

            snakee.pop();
        }


        //console.log(snakee[0]);
        //DIRIGER
        if( direction == "left"){
            snakeeX -= blockSize;
        }
        if( direction == "right"){
            snakeeX += blockSize;

        }
        if( direction == "down"){
            snakeeY += blockSize;
        }
        if( direction == "up"){
            snakeeY -= blockSize;
        }



        //snakee.unshift(snakeX);
        let newHead = {
            x : snakeeX,
            y : snakeeY
        };


        snakee.unshift(newHead);


        // COLLISION bordures
        if((snakeeX >= canvasWidth) || (snakeeX < 0) || (snakeeY >= canvasHeight) || (snakeeY < 0) ){
            console.log("bordures!");
            stopGame();
        }
        else if(autoKill(newHead.x,newHead.y,snakee)){
            console.log("autokill!");
            stopGame();
        }

    }//end snake object

    function autoKill(x,y,array){
        //MONI!!! i à 1 pas à 0 sinon il s auto kill d office!!!!!!!!
        for(var i = 1; i <= array.length; i++){
            if(x == array[i].x && y == array[i].y){
                return true;
            }

        }
        return false;
    }




    function stopGame(){
        clearInterval(game);
    }


}// end onLoad()