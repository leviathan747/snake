const FixedQueue = (function() {

    "use strict";

    // keeps an array of a specific length. when a string is added, the next string is pushed out
    // fixed length queue
    var FixedQueue = function(size) {
        this.size = size;
        this.history = new Array(size);
        for (var i = 0; i < size; i++) this.history[i] = "";
    }

    FixedQueue.prototype.add = function(string) {
        this.history.shift();
        this.history.push(string);
    }

    FixedQueue.prototype.toString = function() {
        return this.history.join(",");
    }

    return FixedQueue;

})();
