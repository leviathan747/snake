// publicly accessible objects

(function() { 
    // CONSTANTS //
    var SPEED = 50;             // milliseconds between update. Default equivilent to 3 seconds to cross the width
    var SIZE = 20;              // block size
    var LENGTH = 5;             // length of the snake initially

    var running;                // if a game has been started
    var set;                    // if a game is ready
    var turned;                 // to keep from turning more than once per update

    var score;

    var width;                  // number of tiles across
    var height;                 // number of tiles top to bottom

    var positions;              // 2D array to keep track of positions

    var loop;                   // interval loop

    var direction;              // direction to update in
    var blocks;

    var tail;                   // pointer to the tail block
    var head;                   // pointer to head block

    function update() {
        var x = head.x + direction.x;
        var y = head.y + direction.y;

        // check position
        var check = checkPosition(x, y);
        if (check == 1) {                   // hit something
            gameOver();
            return;
        }
        else if (check == 2) {              // hit food
            score++;
            createBlock(0,0)
            placeFood();
        }

        // move tail block to front
        positions[tail.x][tail.y] = 0;
        positions[x][y] = 1;
        moveTo(tail, x, y);

        // update linked list
        head.next = tail;
        head = tail;
        tail = tail.next;

        turned = false;
    }

    function placeFood() {
        var x = Math.floor(width * Math.random());
        var y = Math.floor(height * Math.random());

        if (positions[x][y] == 0) {
            moveTo($("#food"), x, y);
            positions[x][y] = 2;
        }
        else placeFood();
    }

    function gameOver() {
        stopGame();
        $("#message").empty().append(score);
        $(".block").css("zIndex", 0);
        $("#message").css("zIndex", 1);
        score = 0;
        set = false;
    }

    function checkPosition(x, y) {
        // check to see if it's in the box
        if (x < 0 || x >= width || y < 0 || y >= height) return 1;

        // check to see if it hit it's tail or the food
        return positions[x][y];
    }

    function moveTo(block, x, y) {
        $(block).css("top", y * SIZE + "px");
        $(block).css("left", x * SIZE + "px");
        block.x = x;
        block.y = y;
    }

    function createBlock(x, y) {
        var block = document.createElement("div");
        block.className = "block";
        $(block).css("height", SIZE);
        $(block).css("width", SIZE);

        moveTo(block, x, y);                            // position the block
        block.x = x;
        block.y = y;
        positions[x][y] = 1;

        block.next = tail;                              // update linked list
        tail = block;

        blocks.push(block);
        $("#board").append(block);
    }

    function startGame() {
        // start update loop
        loop = setInterval(update, SPEED);
        running = true;
    }

    function stopGame() {
        window.clearInterval(loop);
        running = false;
    }

    function left() {
        direction = {x: -1, y: 0};
    }

    function right() {
        direction = {x: 1, y: 0};
    }

    function up() {
        direction = {x: 0, y: -1};
    }

    function down() {
        direction = {x: 0, y: 1};
    }

    function pause() {
        //console.log(set, running);
        if (!set) {
            setup();
        }
        else if (set && !running) {
            startGame();
        }
        else if (set && running) {
            stopGame();
        }
    }

    function keyHandler(e) {
        //console.log(e.keyCode);

        // arrow keys
        if (running && !turned) {
            if (e.keyCode == 37 && direction.y != 0) left();
            else if (e.keyCode == 38 && direction.x != 0) up();
            else if (e.keyCode == 39 && direction.y != 0) right();
            else if (e.keyCode == 40 && direction.x != 0) down();
            else {}
            turned = true;
        }
        
        // space bar
        if (e.keyCode == 32) {
            pause();
        }
        else {}

    }

    function tapHandler(e) {
        // determine which key
        var key = "pane";
        if (e.target == document.getElementById("left-arrow")) key = "left";
        else if (e.target == document.getElementById("up-arrow")) key = "up";
        else if (e.target == document.getElementById("right-arrow")) key = "right";
        else if (e.target == document.getElementById("down-arrow")) key = "down";

        // arrows
        if (running && !turned) {
            if (key == "left" && direction.y != 0) left();
            else if (key == "up" && direction.x != 0) up();
            else if (key == "right" && direction.y != 0) right();
            else if (key == "down" && direction.x != 0) down();
            else {}
            turned = true;
        }

        // pause
        if (key == "pane") pause();
    }

    function resizeWindow() {
        var landscape = window.matchMedia("(orientation: landscape)").matches;
        var desktop = window.matchMedia("(min-device-width: 992px)").matches;

        var percent_x = 1;
        var percent_y = 0.7;

        if (desktop) percent_y = 1;
        else if (landscape) {
            percent_x = 0.7;
            percent_y = 1;
        }

        var windowWidth = window.innerWidth * percent_x;
        var windowHeight = window.innerHeight * percent_y;

        $("#board").css("height", Math.floor(windowHeight / SIZE) * SIZE);
        $("#board").css("margin-top", (Math.floor(windowHeight / SIZE) * SIZE) / -2);
        $("#board").css("width", Math.floor(windowWidth / SIZE) * SIZE);
        $("#board").css("margin-left", (Math.floor(windowWidth / SIZE) * SIZE) / -2);

        height = Math.floor(windowHeight / SIZE);
        width = Math.floor(windowWidth / SIZE);

        SPEED = 3000 / width;
        console.log(SPEED);

    }

    function setup() {
        running = false;        // if a game has been started
        set = false;            // if a game is ready
        turned = false;         // to keep from turning more than once per update

        score = 0;

        width = 0;              // number of tiles across
        height = 0;             // number of tiles top to bottom

        positions = null;       // 2D array to keep track of positions

        loop = null;            // interval loop

        direction = {           // direction to update in
            x: 1,
            y: 0
        };
        blocks = [];

        tail = null;            // pointer to the tail block
        head = null;

        // clear the old blocks
        $(".block").remove(":not(#food)");
        blocks = [];
        $("#message").empty();

        // resize window
        resizeWindow();

        // create position array
        positions = new Array(width);
        for (var j = 0; j < width; j++) {
            positions[j] = new Array(height);
            for (var k = 0; k < height; k++) {
                positions[j][k] = 0;
            }
        }

        // initialize snake
        for (var i = LENGTH - 1; i >= 0; i--) {
            createBlock(i, 0);
        }
        head = blocks[0];

        // place food
        $("#food").css("height", SIZE);
        $("#food").css("width", SIZE);
        placeFood();

        set = true;
    }

    function updateSpeed(speed) {
        SPEED = speed;
        gameOver();
        setup();
    }

    function updateSize(size) {
        SIZE = size;
        gameOver();
        setup();
    }

    function updateLength(length) {
        LENGTH = length;
        gameOver();
        setup();
    }

    $(document).ready(function() {
        setup();

        // initiate keyboard listener
        $(document).keydown(function(e) {keyHandler(e);});

        // initiate touchscreen listener
        $(document).bind('tap', function(e) {tapHandler(e);});

        // initiate resize listener
        $(window).resize(function(e) {
            stopGame();
            setup();
        });
    });
})();
