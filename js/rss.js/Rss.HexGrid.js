'use strict';
/*
 * requires Rss.HexGrid
 */
Rss.HexGrid = function(x, y, hexagonSize, hasBorder, borderColor, appendTo, canvasId) {
    var i, j;
    this.x = x;
    this.y = y;
    this.squareSize = hexagonSize;
    this.borderSize = hasBorder ? 1 : 0;
    
    var self = this;
    
    var rssCanvas = new Rss.Canvas(appendTo, canvasId);
    
    var canvasWidth     = x * hexagonSize + this.borderSize + hexagonSize / 2;
    var canvasHeight    = y * hexagonSize + this.borderSize - (y - 1) * hexagonSize / 4;

    rssCanvas.getCanvas().setAttribute('width', canvasWidth);
    rssCanvas.getCanvas().setAttribute('height', canvasHeight);

    var context = rssCanvas.getContext2d();
    
    var _makeGrid = function() {
        var counter;
        for (i = 0; i <= canvasWidth; i += hexagonSize) {
            counter = 0;
            for (j=0; j < hexagonSize * self.y; j += hexagonSize) {
                if (counter % 2 == 0) {
                    context.moveTo(i, j + (hexagonSize * 1 / 4) - hexagonSize * counter * 1 / 4);
                    context.lineTo(i, j + (hexagonSize * 3 / 4) - hexagonSize * counter * 1 / 4);
                } else {
                    context.moveTo(i + hexagonSize / 2, j + (hexagonSize * 1 / 4) - hexagonSize * counter * 1 / 4);
                    context.lineTo(i + hexagonSize / 2, j + (hexagonSize * 3 / 4) - hexagonSize * counter * 1 / 4);
                }
                
                counter++;
            }
        }

        counter = 0;
        for (i = 0; i <= hexagonSize * self.y; i += hexagonSize) {
            for (j = 0; j < canvasWidth; j += hexagonSize) {
                if (counter % 2 == 0) {
                    if (j + hexagonSize < canvasWidth || i !== 0) {
                        context.moveTo(j, i + hexagonSize * 1 / 4 - hexagonSize * counter * 1 / 4);
                        context.lineTo(j + hexagonSize / 2, i - hexagonSize * counter * 1 / 4);
                        context.lineTo(j + hexagonSize, i + hexagonSize * 1 / 4 - hexagonSize * counter * 1 / 4);
                    }
                } else {
                    if (j + hexagonSize < canvasWidth || i !== hexagonSize * self.y) {
                        context.moveTo(j, i - hexagonSize * counter * 1 / 4);
                        context.lineTo(j + hexagonSize / 2, i + hexagonSize * 1 / 4 - hexagonSize * counter * 1 / 4);
                        context.lineTo(j + hexagonSize / 2 + hexagonSize / 2, i - hexagonSize * counter * 1 / 4);
                        context.lineTo(j + hexagonSize + hexagonSize / 2, i + hexagonSize * 1 / 4 - hexagonSize * counter * 1 / 4);
                    }
                }
                
            }
            counter++;
        }
        
        if (borderColor) {
            context.strokeStyle = borderColor;
            context.stroke();
        }
    }
    
    this.getRssCanvas = function() {
        return rssCanvas;
    }
    
    this.fillSquare = function(x, y, fillStyle) {
        context.fillStyle = fillStyle;
        if (x <= this.x && y <= this.y && x >=0 && y >= 0)
            context.fillRect(x * this.squareSize + this.borderSize, y * this.squareSize + this.borderSize, this.squareSize - this.borderSize, this.squareSize - this.borderSize);
    }
    
    this.clearSquare = function(x, y) {
        if (x <= this.x && y <= this.y && x >=0 && y >= 0)
            context.clearRect(x * this.squareSize + this.borderSize, y * this.squareSize + this.borderSize, this.squareSize - this.borderSize, this.squareSize - this.borderSize);
    }
    
    this.clearAll = function() {
        context.clearRect ( 0 , 0 , canvasWidth , canvasHeight );
        
        if (hasBorder)
            _makeGrid();
    }
    
    this.destroy = function() {
        rssCanvas.destroy();
    }
    
    if (hasBorder)
        _makeGrid();
}