import LinePoints from "./linePoints.js";
export default class Style1 {
    constructor(point) {
        this.index = point;

        this.linePoints = [];
        this.thickness = 2;
        this.xoff = 0;
        this.amp = 20;
        this.linePoint;
        this.background = [0,0,255];
        this.color = color(255,255,255, 110);
    }

    // Draws lines that sweep across the screen in a ribbon-like pattern
    draw() {
        push();
        beginShape(QUADS);
        strokeWeight(this.thickness);
        stroke(this.color);
        noFill();
        
        if (this.index != null) {
            for (let i = 0; i < this.index.length; i++) {

                this.linePoints.push(new LinePoints(this.index[i]));

                
            }
            
        }
        for (let curPoint = 0; curPoint < this.linePoints.length; curPoint++) {
                    this.linePoints[curPoint].draw();
                    this.linePoints[curPoint].update();
                    if (this.linePoints[curPoint].finished()) {
                        this.linePoints.splice(curPoint, 1);
                    }
                }

        endShape();
        pop();
    }

    set indexPoint(point) {
        this.index = point;
    }
    set pointList(pointList) {
        this.linePoints = pointList;
    }

    get myColor() {
        return color(215, 0, 215);
    }
}