Movement = (function() {
    
    function _allowed (piece, x, y, boardMatrix, topToBottom) {
        var allowed = false,
            type = piece.type.split('_')[1];
        switch (type) {
            case 'pawn' :
                if (piece.x === x){
                    if (piece.y - y === 1) {
                        allowed = true;
                    } else if (piece.y - y === 2 && (piece.y === (topToBottom ? 1 : 6))) {
                        allowed = true;
                    }
                }
                break;
            case 'knight' :
                var _knightMoves = [
                    [-1, -2],
                    [-2, -1],
                    [-2, +1],
                    [-1, +2],
                    [+1, +2],
                    [+2, +1],
                    [+2, -1],
                    [+1, -2]
                ]
                if (piece.x - 1 === x && piece.y - 2 === y) {
                    allowed = true;
                } else if (piece.x - 2 === x && piece.y - 1 === y) {
                    allowed = true;
                } else if (piece.x - 2 === x && piece.y + 1 === y) {
                    allowed = true;
                } else if (piece.x + 2 === x && piece.y + 1 === y) {
                    allowed = true;
                }
        }
    
        return allowed;
    }
    
    return {
        allowed : _allowed
    };
})();