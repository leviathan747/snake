Cheat = (function() {

    // returns the next direction
    function getDirection(n) {
        return {
            x: Math.round(Math.cos(Math.PI / 2 * n)),
            y: Math.round(Math.sin(Math.PI / 2 * n))
        };
    }

    var i = 0;
    function doCheat() {
        var direction = null;
        if (i % 10 == 0) direction = getDirection(i / 10);
        i++;
        return direction;
    }

    return {
        cheat: doCheat
    };

})();
