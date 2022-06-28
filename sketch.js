// Neill Kaipo Shikada
// ATLAS Institute
// University of Colorado Boulder

// reference: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-output-from-p5-js/

import Mediapipe from "./MediapipeHands.js";
import { scalePoints, calculateDistance, pythagorean, calculateAngle } from "./functions.js";

const videoElement = document.getElementsByClassName('input_video')[0];

let width = 1280;
let height = 720;
let mp = new Mediapipe();
let indexPoints = [];
let thumbPoints = [];
let wristPoint = [];

// Degrees is the array that gets exported to Arduino, made up of the different servo joints
let shoulderAngle = 0;
let armAngle = 0;
let wristAngle = 0;
let clawAngle = 0;
let degrees = [shoulderAngle, armAngle, wristAngle, clawAngle];

var serial;
var portName = '0COM3';
var inData;
var outByte = 0;

// --------------------------------------------------- //
// ---------------------P5 Setup---------------------- //
// --------------------------------------------------- //
// --------------------------------------------------- //

window.setup = function() {
  createCanvas(windowWidth, windowHeight);

  serial = new p5.SerialPort();
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('list', printList);
  serial.list();
  
  serial.open(portName);

  mp.color = [255, 255, 255];
}

// --------------------------------------------------- //
// -----------------------P5 Draw--------------------- //
// --------------------------------------------------- //
// --------------------------------------------------- //

window.draw = function() {

  // somehow make a way to find the maximum distance between thumb tip and index tip?

  for (point in mp.index) {
    indexPoints.push(scalePoints(mp.index[point]));
    thumbPoints.push(scalePoints(mp.thumb[point]));
    wristPoint.push(scalePoints(mp.wrist[point]));
  }

  background(50);
  fill(255);
  text("incoming value: " + inData, 30, 50);

  // Actions to do if the hand is detected
  if (indexPoints[0] != null) {

    // Draw the lines and angles that correspond to the servo angles
    push();
      stroke(255, 0, 0);
      noFill();
      strokeWeight(5);
      
      ellipse(indexPoints[0].x, indexPoints[0].y, 30);
      ellipse(thumbPoints[0].x, thumbPoints[0].y, 30);
      ellipse(wristPoint[0].x, wristPoint[0].y, 30);
      
      line(indexPoints[0].x, indexPoints[0].y, wristPoint[0].x, wristPoint[0].y);
      line(wristPoint[0].x, wristPoint[0].y, thumbPoints[0].x, thumbPoints[0].y);

      setLineDash([10, 10]);
      line(indexPoints[0].x, indexPoints[0].y, thumbPoints[0].x, thumbPoints[0].y);
      line(width/2, height/2, indexPoints[0].x, indexPoints[0].y);
    pop();

    let distance = calculateDistance(indexPoints[0], thumbPoints[0]);
    // MAXDISTANCE = the pythagorean theorum; index finger length and thumb length are two sides, calculate max hypotenuse when angle = 90
    let v1 = calculateDistance(indexPoints[0], wristPoint[0]);
    let v2 = calculateDistance(thumbPoints[0], wristPoint[0]);
    let v3 = calculateDistance(indexPoints[0], thumbPoints[0]);

    // let MAXDISTANCE = pythagorean(v1, v2);
    // let angle = calculateAngle(v3, v2, v1);

    //console.log(indexPoints[0].y);
    //degrees = int(map(indexPoints[0].y, 0, windowHeight, 0, 180));
    //let d = int(map(distance, 0, MAXDISTANCE, 0, 180));
    // if (d <= 180) {
    //   degrees = d;
    // } else {
    //   degrees = 180;
    // }

    let angle = int(map(distance, 0, 200, 0, 180));
    console.log(shoulderAngle);
    if (angle <= 180) {
      shoulderAngle = angle;
    } else if (angle > 180){
      shoulderAngle = 180;
    } else {
      shoulderAngle = 0;
    }

    degrees = [0, 50, 180];
  }

  // create an array of hand points that all have corresponding places on that array (i.e. indexPoint = [0], thumbPoint = [1], etc.)
  // reference that array in the arduino code
  // calculate the distance between thum tip and index tip for opening and closing the claw (servo 5)
  // calculate angle of a couple hand points to control the angle of the arm (adjusts servo 2 and 3)
  // calculate the direction of the hand (somehow) to control the rotation of the shoulder (servo 1)
  // What controls servo 4? (the wrist)

  // Array (all values scaled to 0 to 180)
  //    [0] = shoulder; 
  //    [1] = arm; angle of two points on the palm
  //    [2] = wrist;
  //    [3] = claw; distance between indextip and thumbtip

  updateAngle();

  indexPoints = [];
  thumbPoints = [];
  wristPoint = [];

}

// --------------------------------------------------- //
// --------------------MediaPipe---------------------- //
// --------------------------------------------------- //
// --------------------------------------------------- //

mp.runMediapipe();

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
    maxNumHands: 1,
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

// --------------------------------------------------- //
// -----------------Serial Functions------------------ //
// --------------------------------------------------- //
// --------------------------------------------------- //

window.serialEvent = function() {
  var inByte = serial.read();
  inData = inByte;
}

window.serialError = function(err) {
  print('Something went wrong with the serial port. ' + err);
}

window.updateAngle = function() {
  outByte = degrees;
  serial.write(outByte);
}

window.printList = function(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + portList[i]);
  }
}

// --------------------------------------------------- //
// ------------------Other Functions------------------ //
// --------------------------------------------------- //
// --------------------------------------------------- //

window.setLineDash = function(list) {
  drawingContext.setLineDash(list);
}