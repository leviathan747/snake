// public API
var Snake;

// cheat function to be overridden
function cheat() {
    // do nothing
    return null;
}

(function() { 
    // CONSTANTS (defaults for mobile) //
    var SPEED = 100;            // milliseconds between update. 
    var SIZE = 15;              // block size
    var LENGTH = 5;             // length of the snake initially

    var DESKTOP_SPEED = 50;
    var DESKTOP_SIZE = 20;

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

    // public API definition
    Snake = function() {

        // return height of board in blocks
        this.getHeight = function() {
            return height;
        }

        // return width of board in blocks
        this.getWidth = function() {
            return width;
        }

        // return 2D array of positions
        this.getPositions = function() {
            return positions;
        }

        // return the current direction
        this.getDirection = function() {
            return direction;
        }

    }

    function update() {
        var x = head.x + direction.x;
        var y = head.y + direction.y;

        // execute cheat
        var new_direction = cheat();
        if (new_direction) direction = new_direction;

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
        $("#message").show();
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
        //console.log(e.target);

        // determine which key
        var key = "pane";
        if (e.target == document.getElementById("top-left")) key = "up left";
        else if (e.target == document.getElementById("bottom-left")) key = "down left";
        else if (e.target == document.getElementById("top-right")) key = "up right";
        else if (e.target == document.getElementById("bottom-right")) key = "down right";

        // arrows
        if (running && !turned) {
            if (new RegExp("left").test(key) && direction.y != 0) left();
            else if (new RegExp("up").test(key) && direction.x != 0) up();
            else if (new RegExp("right").test(key) && direction.y != 0) right();
            else if (new RegExp("down").test(key) && direction.x != 0) down();
            else {}
            turned = true;
        }

        // pause
        if (new RegExp("pane").test(key)) pause();
    }

    function resizeWindow() {
        var landscape = window.matchMedia("(orientation: landscape)").matches;
        var desktop = window.matchMedia("(min-device-width: 992px)").matches;

        // set constants
        if (desktop) {
            SPEED = DESKTOP_SPEED;
            SIZE = DESKTOP_SIZE;
        }

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
        $("#message").hide();

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

    $(document).ready(function() {
        setup();

        // initiate keyboard listener
        $(document).keydown(function(e) {keyHandler(e);});

        // initiate touchscreen listener
        $(document).click(function(e) {tapHandler(e);});

        // initiate resize listener
        $(window).resize(function(e) {
            stopGame();
            setup();
        });

        // bind fastclick
        $(function() {
            FastClick.attach(document.body);
        });
    });
})();
