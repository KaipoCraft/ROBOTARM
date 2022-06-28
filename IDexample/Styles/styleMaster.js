import Style1 from "./style1.js";
import Style2 from "./style2.js";
import Style3 from "./style3.js";

export default class StyleMaster {
    constructor() { 
        this.indexPoint;
        this.thumbPoint;
        
        this.styles = [new Style1(this.indexPoint), 
            new Style2(this.indexPoint), 
            new Style3(this.indexPoint)];
        this.curStyle = this.styles[0];
    }

    drawCurStyle() {
        this.curStyle.draw();
        this.curStyle.indexPoint = this.indexPoint;
        this.curStyle.thumbPoint = this.thumbPoint;
    }

    empty() {
        this.curStyle.pointList = [];
        this.curStyle.branchlist = [];
    }

    get styleNum() {
        return this.styles.length;
    }
    get current() {
        return this.curStyle;
    }
    get styleColor() {
        return this.curStyle.myColor;
    }
    set updateIndexPoint(point) {
        this.indexPoint = point;
    }
    set updateThumbPoint(point) {
        this.thumbPoint = point;
    }
    set setStyleIndex(i) {
        this.curStyle = this.styles[i];
    }

}