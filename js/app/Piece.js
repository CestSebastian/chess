function Piece (type, x, y, pattern, piecesGrid) {
    this.x = x;
    this.y = y;
    this.type = type;
    
    piecesGrid.fillSquare(this.x, this.y, pattern);
    
    this.moveTo = function (toX, toY) {
        _allowedMove(toX, toY);
        piecesGrid.clearSquare(this.x, this.y);
        this.x = toX;
        this.y = toY;
        piecesGrid.fillSquare(this.x, this.y, pattern);
    }
    
    function _allowedMove (x, y) {
        
    }
}