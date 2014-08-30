// keeps an array of a specific length. when a string is added, the next string is pushed out
var History = function(size) {
    this.size = size;
    this.history = new Array(size);
    for (var i = 0; i < size; i++) this.history[i] = "";
}

History.prototype.add = function(string) {
    this.history.shift();
    this.history.push(string);
}

History.prototype.toString = function() {
    return this.history.join(",");
}
