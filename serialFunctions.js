export function serialEvent() {
    var inByte = serial.read();
    inData = inByte;
}
  
export function serialError(err) {
    print('Something went wrong with the serial port. ' + err);
}
  
export function mouseDragged() {
    outByte = int(map(mouseY, 0, height, 0, 255));
    serial.write(outByte);
}
  
export function keyPressed() {
    if (key >= 0 && key <= 9) {
      outByte = byte(key * 25);
    }
    serial.write(outByte);
}
  
export function printList(portList) {
    // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {
      // Display the list the console:
      console.log(i + portList[i]);
    }
}