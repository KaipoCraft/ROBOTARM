// Style 3 is a particle system that releases particles from the hand
import Branch from "./branch.js";
export default class Style3 {
    constructor(point) {
        this.index = point;
        this.thumb = point;

        this.branchlist = [];
    }

    draw() {
        // this.branchlist.push(new Branch(this.index, this.thumb));
        // for (let i = 0; i < this.branchlist.length; i++) {
        //     //this.branchList[i].draw();
        //     // console.log(this.branchlist[i]);
        // }
        
        if (this.index != null) {
            if (this.index.x != 0) {
                for (let i = 0; i < this.index.length; i++) {
                    this.branchlist.push(new Branch(this.index[i], this.thumb[i]));
                }
                
            }
        }
        for (let i = 0; i < this.branchlist.length; i++) {
                    this.branchlist[i].draw();
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
    set pointlist(list) {
        this.branchlist = list;
    }

    get myColor() {
        return color(0, 215, 215);
    }
}