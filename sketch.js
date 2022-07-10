// Neill Kaipo Shikada
// ATLAS Institute
// University of Colorado Boulder

// reference: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-output-from-p5-js/
// other reference: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/two-way-duplex-serial-communication-using-p5js/

import Mediapipe from "./MediapipeHands.js";
import { scalePoints, calculateDistance, findMidpoint } from "./functions.js";

// enable camera
const videoElement = document.getElementsByClassName('input_video')[0];

let mp = new Mediapipe();
// place to put info about points on hand
let indexPoints = [];
let thumbPoints = [];
let wristPoints = [];

let previousArray;
let newArray;
let sendBoolean;
let inData;
let boundHeight;
let boundWidth;

// angle that is exported to the arduino for the servo
// [claw, wrist, arm1, arm2, shoulder]
let degrees = [ 60, 0, 150, 100, 90 ];
let encodedDegrees = [];

// everything the serial controller needs
var serial;
var portName = '0COM3';

// --------------------------------------------------- //
// ---------------------P5 Setup---------------------- //
// --------------------------------------------------- //
// --------------------------------------------------- //

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  boundHeight = 200;
  boundWidth = 400;

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

  // takes the points from mediapipe, and scales them to the canvas
  for (point in mp.index) {
    indexPoints.push(scalePoints(mp.index[point]));
    thumbPoints.push(scalePoints(mp.thumb[point]));
    wristPoints.push(scalePoints(mp.wrist[point]));
  }
  let iP = indexPoints[0];
  let tP = thumbPoints[0];
  let wP = wristPoints[0];

  // style elements
  background(50);
  fill(255);
  stroke(255, 255, 255);
  noFill();
  rect(boundWidth, boundHeight, windowWidth-boundWidth*2, windowHeight-boundHeight*2);

  // Actions to do if the hand is detected
  if (iP != null) {
    
    // get the distance between the index and thumb
    let distance = calculateDistance(iP, tP);

    if (distance > 200) {
      distance = 200;
    } else if (distance < 20) {
      distance = 20;
    }
    
    // scales the distance between 0 and 180 #TODO
    let angleClaw = int(map(distance, 20, 200, 55, 180));
    let angleWrist = int(map(windowHeight - tP.y, boundHeight, windowHeight - boundHeight, 0, 180));
    let angleArm = int(map(windowHeight - iP.y, boundHeight, windowHeight-boundHeight, 0, 180));
    let angleBase = int(map(iP.x, boundWidth, windowWidth - boundWidth, 0, 180));
    
    if (angleClaw > 180) {
      angleClaw = 180;
    } else if (angleClaw < 0) {
      angleClaw = 0;
    }
    if (angleWrist > 180) {
      angleWrist = 180;
    } else if (angleWrist < 0) {
      angleWrist = 0;
    }
    if (angleArm > 180) {
      angleArm = 180;
    } else if (angleArm < 0) {
      angleArm = 0;
    }
    if (angleBase > 180) {
      angleBase = 180;
    } else if (angleBase < 0) {
      angleBase = 0;
    }

    // angleArm controls two servos that make up the arm
    // this scales the two servos so that 0 - 180 degrees corresponds to different measurements on each servo
    let angleArm1 = int(map(angleArm, 0, 180, 65, 165));
    let angleArm2 = int(map(angleArm, 0, 180, 0, 90));

    

    degrees = [angleClaw, angleWrist, angleArm2, angleArm1, angleBase];

    // ui to show the measurements affecting the servos
    push();
      stroke(255, 255, 255);
      noFill();

      push();
        setLineDash([10, 10]);
        line(iP.x, iP.y, iP.x, windowHeight - boundHeight);
        line(iP.x, iP.y, windowWidth-boundWidth, iP.y);
        line(iP.x, iP.y, tP.x, tP.y);
      pop();
      
      ellipse(iP.x, iP.y, 30);
      ellipse(tP.x, tP.y, 30);

      // show claw angle
      push();
        let mid1 = findMidpoint(iP, tP);
        translate(mid1.x, mid1.y);
        scale(-1,1);
        text(degrees[0],0, 0);
      pop();
      // show wrist angle
      push();
        let v2 = createVector(windowWidth-boundWidth, iP.y);
        let mid2 = findMidpoint(iP, v2);
        translate(mid2.x, mid2.y);
        scale(-1,1);
        text(degrees[1],0, 0);
      pop();
      // show arm angle
      push();
        let v3 = createVector(iP.x, windowHeight - boundHeight);
        let mid3 = findMidpoint(iP, v3);
        translate(mid3.x, mid3.y);
        scale(-1,1);
        text(angleArm,0, 0);
      pop();
      // show base angle
      push();
        let mid4 = findMidpoint(iP, (0,0));
        translate(mid4.x, mid4.y);
        scale(-1,1);
        text(degrees[4],0, 0);
      pop();
    pop();
  }
  
  newArray = degrees;

  sendBoolean = arraysEqual(previousArray, newArray);

  encodedDegrees = encodeOutByte(degrees);
  
  // !!! Arduino doesn't seem to like recieving the same array twice in a row
  // this sees the new array and checks if it's the same as the previous so it doesn't send duplicates
  if (sendBoolean == false) {
    console.log(encodedDegrees);
    // actually sends the data to the arduino
    updateAngle(encodedDegrees);
  } else {
    console.log("Duplicate array");
  }

  // resets the hand points every time
  indexPoints = [];
  thumbPoints = [];
  wristPoints = [];

  previousArray = degrees;
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
  //console.log(inData);
}

window.serialError = function(err) {
  print('Something went wrong with the serial port. ' + err);
}

window.updateAngle = function(outByte) {
  // serial.write(outByte);
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

// #TODO function that encodes array to string
// valueOne + "," + valueTwo + "\n"
window.encodeOutByte = function(arrayOut) {

  let encodedArray = arrayOut.toString();// + "\n";

  return encodedArray;
}

window.arraysEqual = function(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}