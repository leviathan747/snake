Cheat = (function () {

    // CHEAT BRUTE PERCOLATION

    /**
      * This cheat function works by evaluating all of the possible four moves
      * and organizing the into one of five categories by checking three things:
      * whether or not it will end the game, whether or not it will get you closer
      * to the food, and whether or not all the blank space in the board is connected.
      *
      * good_moves          moves that get you closer to the food, don't kill you, and
      *                     the board percolates.
      * fine_moves          moves that don't get you closer to the food, but they don't
      *                     kill you and the board still percolates.
      * decent_moves        moves that get you closer to the food, you don't die, but
      *                     the board doesn't percolate
      * sketchy_moves       moves that don't get you closer to the food, the board doesn't
      *                     percolate, but at least you don't die
      * bad_moves           moves that kill you
      *
      * After all four possible moves are sorted, the first move is selected from the
      * first group in this order.
      */

    var moves = [
        {x: -1, y: 0},      // left
        {x: 0, y: -1},      // up
        {x: 1, y: 0},       // right
        {x: 0, y: 1}        // down
    ];

    var good_moves = [];
    var fine_moves = [];
    var decent_moves = [];
    var sketchy_moves = [];
    var bad_moves = [];

    // sort all four possible moves into the five categories
    function sort_moves() {
        // clear categories
        good_moves = [];
        fine_moves = [];
        decent_moves = [];
        sketchy_moves = [];
        bad_moves = [];

        // sort the moves
        for (var i = 0; i < moves.length; i++) {
            // define deciders
            var kill = kills_you(moves[i]);
            if (kill) {
                bad_moves.push(moves[i]);
                continue;                   // skip calculations this is a bad move
            }

            var closer = closer_to_food(moves[i]);
            var perc = percolates(moves[i]);

            if (!closer && !perc) sketchy_moves.push(moves[i]);
            else if (closer && !perc) decent_moves.push(moves[i]);
            else if (!closer && perc) fine_moves.push(moves[i]);
            else good_moves.push(moves[i]);
        }
    }

    // choose the best move
    function choose_move() {
        if (good_moves.length > 0) return good_moves[0];
        else if (fine_moves.length > 0) return fine_moves[0];
        else if (decent_moves.length > 0) return decent_moves[0];
        else if (sketchy_moves.length > 0) return sketchy_moves[0];
        else return bad_moves[0];
    }

    // does the move kill you
    function kills_you(move) {
        var pos = Snake.getPosition();
        var check = Snake.checkPosition(pos.x + move.x, pos.y + move.y);
        if (check == 1) return true;
        else return false;
    }

    // does the move get closer to the food
    function closer_to_food(move) {
        var pos = Snake.getPosition();
        var new_pos = {x: pos.x + move.x, y: pos.y + move.y};
        var food_pos = Snake.getFoodPosition();

        if ((Math.abs(new_pos.x - food_pos.x) < Math.abs(pos.x - food_pos.x)) || 
            (Math.abs(new_pos.y - food_pos.y) < Math.abs(pos.y - food_pos.y)) ) {
            return true;
        }
        else return false;
    }

    // does the board percolate
    function percolates(move) {
        var positions = Snake.getPositions();
        var height = Snake.getHeight();
        var width = Snake.getWidth();

        // move tail to where we're going
        var head = Snake.getPosition();
        var tail = Snake.getTailPosition();
        positions[tail.x][tail.y] = 0;
        positions[head.x + move.x][head.y + move.y] = 1;

        // recursive function to fill in all adjacent 0's with 1's
        function domino(x, y) {
            //console.log(x, y, positions[x][y]);
            if (x < 0 || x >= width || y < 0 || y >= height) return;
            positions[x][y] = 1;                                            // flip 0 to 1
            if (x-1 >= 0 && positions[x-1][y] == 0) domino(x-1, y);         // left
            if (y-1 >= 0 && positions[x][y-1] == 0) domino(x, y-1);         // up
            if (x+1 < width && positions[x+1][y] == 0) domino(x+1, y);      // right
            if (y+1 < height && positions[x][y+1] == 0) domino(x, y+1);     // down
        }

        // fill all adjacent 0's
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (positions[x][y] == 0) domino(x, y);
                break;
            }
        }

        // if there are any 0's left, return false
        //console.log(JSON.stringify(positions));
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                if (positions[i][j] == 0) return false;
            }
        }

        // all filled in
        return true;
    }

    // Outward facing API
    BrutePerc = {};

    BrutePerc.cheat = function() {
        sort_moves();
        return choose_move();
    }

    return BrutePerc;
})();
