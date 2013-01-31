function Chess (domRef) {
    var board       = new Rss.Grid(8, 8, 50, true, 'gray', domRef, 'board'),
        piecesGrid  = new Rss.Grid(8, 8, 50, false, 'gray', domRef, 'pieces'),
        piecesCtx   = piecesGrid.getRssCanvas().getContext2d(),
        i, j,
        self = this;
        
    for (i=0; i<8; i++) {
        for (j=0; j<8; j++) {
            board.fillSquare(i, j, ((i + j) % 2 === 0) ? 'white' : '#9B4');
        }
    }
    
    var pieces = [],
        players = ['white', 'black'],
        pieceTypes = {
            'king'      : 1,
            'queen'     : 1,
            'rook'      : 2,
            'bishop'    : 2,
            'knight'    : 2,
            'pawn'      : 8
        },
        patterns = {};
    
    function _loadPatterns () {
        var piece, loadedPieces = 0, image;
        
        players.forEach(function (color) {
            for (piece in pieceTypes) {
                image = new Image();
                
                image.onload = (function (color, piece) {
                    return function() {
                        patterns[color + '_' + piece] = piecesCtx.createPattern(this, 'repeat');
                        loadedPieces++;
                        
                        if (loadedPieces == 12)
                            self.emit('piecesLoaded');
                    }
                })(color, piece);
                
                image.src = 'images/' + color + '_' + piece + '.png';
            }
        });
    }
    
    this.initBoard = function () {
        console.log(patterns)
        var i, x, y, piece, pattern;
        pieces = [];
        players.forEach(function(color) {
            for(piece in pieceTypes) {
                if (piece === 'pawn') {
                    y = (color === 'white' ? 6 : 1);
                } else {
                    y = (color === 'white' ? 7 : 0);
                }
                pattern = patterns[color + '_' + piece];
                
                for (i=0; i<pieceTypes[piece]; i++) {
                    if (piece === 'rook') {
                        x = (i === 0 ? 0 : 7);
                    } else if (piece === 'knight') {
                        x = (i === 0 ? 1 : 6);
                    } else if (piece === 'bishop') {
                        x = (i === 0 ? 2 : 5);
                    } else if (piece === 'king') {
                        x = (color === 'white' ? 3 : 4);
                    } else if (piece === 'queen') {
                        x = (color === 'white' ? 4 : 3);
                    } else {
                        x = i;
                    }
                    
                    console.log(piece, x, y)
                    pieces.push(new Piece(x, y, pattern, piecesGrid));
                }
            }
        });
    }
    
    this.drawPieces = function () {
        
    }
    
    this.on('piecesLoaded', function () {
        self.initBoard();
    });
    
    _loadPatterns();
}

Chess.prototype = new Rss.EventEmitter();