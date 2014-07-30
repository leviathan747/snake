// function for duplicating arrays
Array.prototype.clone = function() {
    var arr = this.slice(0);
    for( var i = 0; i < this.length; i++ ) {
        if( this[i].clone ) {
            arr[i] = this[i].clone();
        }
    }
    return arr;
}

