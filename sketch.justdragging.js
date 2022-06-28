// Neill Kaipo Shikada
// ATLAS Institute
// University of Colorado Boulder

// reference: https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-output-from-p5-js/

import Mediapipe from "./MediapipeHands.js";
import { scalePoints } from "./functions.js";

var serial;
var portName = '0COM3';
var inData;
var outByte = 0;

window.setup = function() {
  createCanvas(400, 300);
  serial = new p5.SerialPort();
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('list', printList);
  serial.list();
  
  serial.open(portName);
}

window.draw = function() {
  background(50);
  fill(255);
  text("incoming value: " + inData, 30, 50);
}

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

window.mouseDragged = function() {
  outByte = int(map(mouseY, 0, height, 0, 180));
  serial.write(outByte);
}

window.keyPressed = function() {
  if (key >= 0 && key <= 9) {
    outByte = byte(key * 25);
  }
  serial.write(outByte);
}

window.printList = function(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + portList[i]);
  }
}