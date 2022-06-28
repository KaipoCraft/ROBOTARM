// Neill Kaipo Shikada
// ATLAS Institute
// University of Colorado Boulder

import Pointer from "./UI/pointer.js";
import Button from "./UI/button.js";
import StyleMaster from "./Styles/styleMaster.js";
import Mediapipe from "./MediapipeHands.js";
import { scalePoints } from "./functions.js";

const videoElement = document.getElementsByClassName('input_video')[0];

let width = 1280;               // Width of the canvas
let height = 720;               // Height of the canvas
let c;                          // Hand Line Color

let drawStyle;
let pointer;
let mp = new Mediapipe();
let indexPoints = [];
let thumbPoints = [];

//--------------------------------------//
//--------------P5 Setup----------------//
//--------------------------------------//
window.setup = function() {
    createCanvas(windowWidth, windowHeight);

    c = color(250,250,250);

    pointer = new Pointer(indexPoints);

    drawStyle = new StyleMaster(indexPoints);

}

//--------------------------------------//
//---------------P5 Draw----------------//
//--------------------------------------//
window.draw = function() {
    
    for (point in mp.index) {
        indexPoints.push(scalePoints(mp.index[point]));
        thumbPoints.push(scalePoints(mp.thumb[point]));
    }
    
    // if (indexPoints != null) {
    //     if (indexPoints.x = 0) {
    //     push();
    //     fill(255);
    //     stroke(255);
    //     textAlign(CENTER);
    //     text('Show hands!', width/2, height/2);
    //     pop();
    //     }
    // }


    //if (indexPoints != null) {
        //if (indexPoints.x != 0) {
            //console.log(indexPoints);
            //pointer.draw();
            for (let i = 0; i < indexPoints.length; i++) {
                pointer.updatePoint = indexPoints[i];
                
            }
            for (let i = 0; i < thumbPoints.length; i++) {
                
            }
            //pointer.draw();
        //}   
    //}

    // 215, 140, 255
    background(0, 0, 0);

    //pointer.draw();
    //pointer.updatePoint = indexPoints;

    // // Slider for color
    // push();
    // fill(255);
    // stroke(255);
    // rect(width-300, 100, 50, 300);
    // pop();

    // Makes button to change between styles
    for (let i = 0; i <= drawStyle.styleNum; i++) {

        let btnMargin = 20;
        let btnX = 0 + btnMargin;
        let btnY = height/(drawStyle.styleNum)*(i-1) + btnMargin;
        
        let btnPoint = createVector(btnX, btnY);
        let btn = new Button(btnPoint, drawStyle.styleNum,'Style ' + i);

        mp.setColor = drawStyle.styleColor;

        for (let j = 0; j < indexPoints.length; j++) {
            if (indexPoints[j].x < btn.area[1] + width/4) {
                btn.draw();
            }
            
            if (indexPoints[j].y >= btn.area[0]
                && indexPoints[j].x <= btn.area[1]
                && indexPoints[j].y <= btn.area[2]
                && indexPoints[j].x >= btn.area[3]) 
            {
                console.log("Button " + i + " pressed!");
                btn.activated();
                    
                drawStyle.empty();
                drawStyle.setStyleIndex = i-1;
                    
            }
        }
    }
    
    drawStyle.drawCurStyle();
    drawStyle.updateIndexPoint = indexPoints;
    drawStyle.updateThumbPoint = thumbPoints;

    indexPoints = [];
}

//--------------------------------------//
//--------------Mediapipe---------------//
//--------------------------------------//

mp.runMediapipe();

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.7
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();