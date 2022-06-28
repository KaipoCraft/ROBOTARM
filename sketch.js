// Neill Kaipo Shikada
// ATLAS Institute
// University of Colorado Boulder

// reference: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-output-from-p5-js/

import Mediapipe from "./MediapipeHands.js";
import { scalePoints, calculateDistance } from "./functions.js";

// enable camera
const videoElement = document.getElementsByClassName('input_video')[0];

let width = 1280;
let height = 720;
let mp = new Mediapipe();
// place to put info about points on hand
let indexPoints = [];
let thumbPoints = [];
let wristPoint = [];

// angle that is exported to the arduino for the servo
let degrees;

// everything the serial controller needs
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

  // color of the hand
  mp.color = [255, 255, 255];
}

// --------------------------------------------------- //
// -----------------------P5 Draw--------------------- //
// --------------------------------------------------- //
// --------------------------------------------------- //

window.draw = function() {

  // somehow make a way to find the maximum distance between thumb tip and index tip?

  // takes the points from mediapipe, and scales them to the canvas
  for (point in mp.index) {
    indexPoints.push(scalePoints(mp.index[point]));
    thumbPoints.push(scalePoints(mp.thumb[point]));
    wristPoint.push(scalePoints(mp.wrist[point]));
  }


  background(50);
  fill(255);
  // display the data coming back from the arduino to make sure it's the same as when it was sent
  text("incoming value: " + inData, 30, 50);

  // Actions to do if the hand is detected
  if (indexPoints[0] != null) {
    
    // get the distance between the index and thumb
    let distance = calculateDistance(indexPoints[0], thumbPoints[0]);

    // scales the distance between 0 and 180 #TODO
    let angle = int(map(indexPoints[0].y, 0, windowHeight, 0, 180));

    // #TODO want degrees to have multiple angles for multiple motors
    degrees = angle;

    // make sure the angle stays within bounds (0< x <180)
    console.log(degrees);
    // if (angle <= 180) {
    //   degrees = angle;
    // } else if (angle > 180){
    //   degrees = 180;
    // } else {
    //   degrees = 0;
    // }
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

  // actually sends the data to the arduino
  updateAngle();

  // resets the hand points every time
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