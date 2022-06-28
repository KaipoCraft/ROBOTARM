import Point from "./point.js";
export default class Style2 {
    constructor(point) {
        this.index = point;
        this.thumb = point;

        this.pointList = [];
        this.numPoints = 100;
    }

    draw() {

        if (this.index != null) {
            if (this.index.x != 0) {
                for (let i = 0; i < this.index.length; i++) {
                    this.pointList.push(new Point(this.index[i].x, this.index[i].y));
                }
            }
        }
        
        for (let i = 0; i < this.pointList.length; i++) {
            this.pointList[i].draw();
            if (this.pointList[i].finished()) {
                this.pointList.splice(i, 1);
            }
        }
    }

    update() {
        
    }

    set indexPoint(point) {
        this.index = point;
    }
    set thumbPoint(point) {
        this.thumb = point;
    }

    get myColor() {
        return color(215, 215, 0);
    }
}