// Troubleshooting -
// Can't seem to change "indeTipPoints" in the rest of code
// Scope issue?

export default class Mediapipe {
    constructor() {
        this.indexTipPoint = [];
        this.thumbTipPoint = [];
        this.handThickness = 4;
        this.color = [215, 140, 255];
    }

    runMediapipe() {
        
        window.onResults = (results) => {
            if (results.multiHandLandmarks) {

                this.indexTipPoint = [];
                this.thumbTipPoint = [];

                    for (const landmarks of results.multiHandLandmarks) {
                        push();
                        let i = 0;
            
                        do {
                            fill(this.color);
                            let x = landmarks[i].x*width;
                            let y = landmarks[i].y*height;
                            let z = landmarks[i].z;
                            ellipse(x,y,this.handThickness);
                            i++
                        }
                        while (i < landmarks.length);
            
                        stroke(this.color);
                        strokeWeight(this.handThickness+1);
                        var palm = [0,1,5,9,13,17];
                        for (var j = 0; j < landmarks.length; j++) {
                            let x = landmarks[j].x*width;
                            let y = landmarks[j].y*height;
            
                            var isPalm = palm.indexOf(j);
                            var next;
                            if (isPalm == -1) {
                                next = landmarks[j-1];
                            } else {
                                next = landmarks[palm[(isPalm+1)%palm.length]];
                            }
            
                            line(x, y, next.x*width, next.y*height);

                        }
                    
                        this.indexTipPoint.push(landmarks[8]);
                        this.thumbTipPoint.push(landmarks[4]);

                        pop();
                    }
            }
        }
    }

    set setColor(newColor) {
        this.color = newColor;
    }

    get index() {
        return this.indexTipPoint;
    }
    get thumb() {
        return this.thumbTipPoint;
    }
    get handNum() {
        return this.handList;
    }
}