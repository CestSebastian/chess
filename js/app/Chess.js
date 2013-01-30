function Chess (domRef) {
    var board       = new Rss.Canvas(domRef, 'board'),
        piecesGrid  = new Rss.Grid(8, 8, 75, false, 'gray', domRef, 'pieces'),
        boarderBackground = new Image();
    
    board.getCanvas().setAttribute('width', 600);
    board.getCanvas().setAttribute('height', 600);
    
    var boardCtx    = board.getContext2d();
    boarderBackground.onload = function () {
        var pattern = boardCtx.createPattern(this, 'no-repeat');
        
        boardCtx.fillStyle = pattern;
        boardCtx.fillRect(0, 0, 600, 600);
    }
    
    boarderBackground.src = 'images/board.jpg';
    
    var pieces = [],
        pieceTypes = {
            'king'      : 1,
            'queen'     : 1,
            'rook'      : 2,
            'bishop'    : 2,
            'knight'    : 2,
            'pawn'      : 8
        };
    
    for (var i=0; i<16; i++) {
        pieces.push(new Piece());
    }
}