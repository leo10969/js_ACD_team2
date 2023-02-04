/*
MIT License

Copyright (c) 2023 ACD 
original: https://github.com/frogcat/canvas-arrow/blob/master/canvas-arrow.js
Method update() and function to draw a label in the middle of the arrow are 
added to the original progam. 

Copyright (c) 2017 Yuzo Matsuzawa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
export function arrow(startX, startY, endX, endY, controlPoints){
    this.startX;
    this.startY;
    this.endX;
    this.endY;
    this.label = "";
    var dx;
    var dy;
    var len;
    var sin;
    var cos;
    var a = [];

    this.update = function(startX, startY, endX, endY, controlPoints){
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        dx = this.endX - this.startX;
        dy = this.endY - this.startY;
        len = Math.sqrt(dx * dx + dy * dy);
        sin = dy / len;
        cos = dx / len;
        a = [];
        a.push(0, 0);
        for (var i = 0; i < controlPoints.length; i += 2) {
            var x = controlPoints[i];
            var y = controlPoints[i + 1];
            a.push(x < 0 ? len + x : x, y);
        }
        a.push(len, 0);
        for (var i = controlPoints.length; i > 0; i -= 2) {
            var x = controlPoints[i - 2];
            var y = controlPoints[i - 1];
            a.push(x < 0 ? len + x : x, -y);
        }
        a.push(0, 0);
    }

    // Initialized
    this.update(startX, startY, endX, endY, controlPoints);

    this.draw = function(ctx, color="gray"){
        ctx.save();
        // Draw the arrow.
        ctx.beginPath();
        ctx.fillStyle = color;
        for (var i = 0; i < a.length; i += 2) {
            var x = a[i] * cos - a[i + 1] * sin + this.startX;
            var y = a[i] * sin + a[i + 1] * cos + this.startY;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.fill();
        ctx.closePath();

        // Draw the label on ctx.
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.font = "10pt 游明朝";
        var width = ctx.measureText(this.label).width;
        ctx.fillRect((this.startX + this.endX)/2 - width/2, (this.startY + this.endY)/2 - 8, width, 15);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(this.label, (this.startX + this.endX)/2 - width/2, (this.startY + this.endY)/2)
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}