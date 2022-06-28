export default class Button {
    // Takes x coordinate, y coordinate, and label as a string
    constructor(point, btnNum, label) {
        this.point = point;
        this.btnNum = btnNum;
        this.label = label;
  
        this.width = 500/btnNum;
        this.height = 500/btnNum;
        this.color = 255;
        this.activeColor = color(10 * btnNum, 10 * btnNum, 0);
        this.thickness = 5;
        this.active = false;
    }

    draw() {
        push();
            stroke(this.color);
            strokeWeight(this.thickness);
            fill(this.color, 75);
            rect(this.point.x, this.point.y, this.width, this.height);

            // Label
            translate(this.point.x, this.point.y);
            textSize(20);
            noStroke();
            fill(this.color);
            textAlign(CENTER, CENTER);
            translate(this.width/2, this.height-15);
            scale(-1,1);
            text(this.label, 0, 0);
        pop();
    }

    activated() {
        fill(this.activeColor);
        noStroke();
        rect(this.point.x, this.point.y, this.width, this.height);
    }
    
    get area() {
        // returns the edges of the button
        let topEdge = this.point.y
        let leftEdge = this.point.x + this.width
        let btmEdge = this.point.y + this.height
        let rightEdge = this.point.x
        let a = [topEdge, leftEdge, btmEdge, rightEdge];
        return a;
    }
    
}