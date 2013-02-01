function Chess (domRef) {
    var board       = new Rss.Grid(8, 8, 50, true, 'gray', domRef, 'board'),
        boardCtx    = board.getRssCanvas().getContext2d(),
        actionBoard = new Rss.Grid(8, 8, 50, true, 'gray', domRef, 'action-board'),
        piecesGrid,
        i, j, boardMatrix,
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
                        patterns[color + '_' + piece] = boardCtx.createPattern(this, 'repeat');
                        loadedPieces++;
                        
                        if (loadedPieces == 12)
                            self.emit('piecesLoaded');
                    }
                })(color, piece);
                
                image.src = 'images/' + color + '_' + piece + '.png';
            }
        });
    }
    
    this.initBoard = function (inverted) {
        if (boardMatrix) {
            this.destroy();
        }
        
        piecesGrid  = new Rss.Grid(8, 8, 50, false, 'gray', domRef, 'pieces');
        
        boardMatrix = new Array(8);
        
        for (i=0; i<8; i++) {
            boardMatrix[i] = new Array(8);
        }
        
        _drawPieces(inverted);
        
        piecesGrid.on('click', function(coords) {
            _clicked(coords.x, coords.y);
        });
        
        this.emit('ready');
    }
    
    function _drawPieces(inverted) {
        var i, x, piece, topColor, botColor, topKey, botKey;

        topColor = (inverted ? 'white' : 'black');
        botColor = (inverted ? 'black' : 'white');

        // adding pawns
        for (i=0; i<8; i++) {
            piece = 'pawn';
            topKey = topColor + '_' + piece;
            botKey = botColor + '_' + piece;
            
            boardMatrix[i][1] = new Piece(topKey, i, 1, patterns[topKey], piecesGrid);
            boardMatrix[i][6] = new Piece(botKey, i, 6, patterns[botKey], piecesGrid);
        }
        
        
        // rook, knight, bishop
        ['rook', 'knight', 'bishop'].forEach(function(piece) {
            var x1, x2;
            if ('rook' === piece) {
                x1 = 0;
                x2 = 7;
            } else if ('knight' === piece) {
                x1 = 1;
                x2 = 6;
            } else if ('bishop' === piece) {
                x1 = 2;
                x2 = 5;
            }
            
            topKey = topColor + '_' + piece;
            botKey = botColor + '_' + piece;

            boardMatrix[x1][0] = new Piece(topKey, x1, 0, patterns[topKey], piecesGrid);
            boardMatrix[x2][0] = new Piece(topKey, x2, 0, patterns[topKey], piecesGrid);
            boardMatrix[x1][7] = new Piece(topKey, x1, 7, patterns[botKey], piecesGrid);
            boardMatrix[x2][7] = new Piece(topKey, x2, 7, patterns[botKey], piecesGrid);
        });
        
        
        // the queen
        piece = 'queen';
        topKey = topColor + '_' + piece;
        botKey = botColor + '_' + piece;
        
        x = (inverted ? 4 : 3);
        boardMatrix[x][0] = new Piece(topKey, x, 0, patterns[topKey], piecesGrid);
        boardMatrix[x][7] = new Piece(topKey, x, 7, patterns[botKey], piecesGrid);
        
        
        // the king
        piece = 'king';
        topKey = topColor + '_' + piece;
        botKey = botColor + '_' + piece;
        
        x = (inverted ? 3 : 4);
        boardMatrix[x][0] = new Piece(topKey, x, 0, patterns[topKey], piecesGrid);
        boardMatrix[x][7] = new Piece(topKey, x, 7, patterns[botKey], piecesGrid);
    }
    
    function _clicked (x, y) {
        if (_selectedPiece) {
            _moveSelected(x, y);
        } else if (boardMatrix[x][y]) {
            self.selectPiece(x, y);
        }
    }
    
    function _moveSelected (x, y) {
        var piece = boardMatrix[_selectedPiece.x][_selectedPiece.y];
        if (!Movement.allowed(piece, x, y, boardMatrix)) {
            self.unhighlightPosition(_selectedPiece.x, _selectedPiece.y);
            _selectedPiece = null;
            return;
        }
        
        boardMatrix[x][y] = piece;
        boardMatrix[_selectedPiece.x][_selectedPiece.y] = undefined;
        self.unhighlightPosition(_selectedPiece.x, _selectedPiece.y);
        _selectedPiece = null;
        boardMatrix[x][y].moveTo(x, y);
    }
    
    function _allowed (x, y) {
        var piece = boardMatrix[_selectedPiece.x][_selectedPiece.y],
            typeSplit = piece.type.split('_'),
            color = typeSplit[0],
            type = typeSplit[1];
        
        if (!boardMatrix[x][y]) {
            
            return true;
        } else {
            return false;
        }
        
        return true;
    }
    
    var _selectedPiece = null;
    
    this.selectPiece = function (x, y) {
        if (!boardMatrix[x][y]) {
            return;
        }
        
        if (!_selectedPiece) {
            _selectedPiece = { 'x' : x, 'y' : y };
            this.highlightPosition(x, y);
        } else if (_selectedPiece.x === x && _selectedPiece.y === y) {
            this.unhighlightPosition(x, y);
            _selectedPiece = null;
        } else {
            this.unhighlightPosition(_selectedPiece.x, _selectedPiece.y);
            _selectedPiece = { 'x' : x, 'y' : y };
            this.highlightPosition(x, y);
        }
    }
    
    this.highlightPosition = function (x, y) {
        actionBoard.fillSquare(x, y, "rgba(70, 70, 255, 1)");
    }
    
    this.unhighlightPosition = function (x, y) {
        actionBoard.clearSquare(x, y);
    }
    
    this.destroy = function () {
        boardMatrix = undefined;
        piecesGrid.destroy();
    }
    
    this.on('piecesLoaded', function () {
        this.initBoard();
    });
    
    _loadPatterns();
}

Chess.prototype = new Rss.EventEmitter();