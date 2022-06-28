export default class Pointer {
    constructor(point) {
        this.point = point;
        this.angle = 0;
        this.r = 25;
        this.color = 255, 255, 255;
    }

    setLineDash(list) {
        drawingContext.setLineDash(list);
    }

    draw() {

        if (this.point != null) {
            push();
                translate(this.point.x, this.point.y);
            
                push();
                    noFill();
                    stroke(this.color);
                    strokeWeight(3);
                    this.setLineDash([6, 10]);
                    rotate(this.angle);
                    ellipse(0, 0, this.r*2);
                pop();
    
                push();
                    scale(-1,1);
                    translate(this.r, -this.r);
                    textSize(30);
                    fill(this.color);
                    text('index', 0, 0);
                pop();
            pop();
        }
        
        this.update();
    }
    
    update() {
        this.angle += 3;
    }

    /**
     * @param {any} x
     */
    set updatePoint(point) {
        this.point = point;
    }
}