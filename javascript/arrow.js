export function arrow(startX, startY, endX, endY, controlPoints){
    this.startX;
    this.startY;
    this.endX;
    this.endY;
    var dx;
    var dy;
    var len;
    var sin;
    var cos;
    var label = "";
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

    this.draw = function(ctx){
        ctx.save();
        // Draw the arrow.
        ctx.beginPath();
        ctx.fillStyle = "gray";
        for (var i = 0; i < a.length; i += 2) {
            var x = a[i] * cos - a[i + 1] * sin + this.startX;
            var y = a[i] * sin + a[i + 1] * cos + this.startY;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.fill();
        ctx.closePath();

        // Draw the label on ctx.
        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        var width = ctx.measureText(this.label).width;
        ctx.fillText(this.label, (this.startX + this.endX)/2 - width/2, (this.startY + this.endY)/2)
        ctx.restore();
    }
}