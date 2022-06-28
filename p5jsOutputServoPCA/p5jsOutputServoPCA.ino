 // Adafruit Servo Driver Library: https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

// Goal = to make a servo react to serial data from p5js
// Calibrate the servos to find SERVOMIN and SERVOMAX
// Use the "map()" function to translate to degrees
// pulselength = map(degrees, 0, 180, SERVOMIN, SERVOMAX)

// Create an "update angle" function
// This function will run through each of the servos and update their position gradually
// Not sure how to make multiple servos move at once - ask Zack

// Figure out how to assign different measurements on the hand to different servos

#include <Servo.h>
#include <Adafruit_PWMServoDriver.h>

Servo myservo;
int pos = 0;

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

#define SERVOMIN 70     // Min for the larger servo
#define SERVOMAX 505    // Max for the larger servo
#define SMSERVOMIN 150  // Min for the smaller servo
#define SMSERVOMAX 600  // Max for the smaller servo
#define SERVO_FREQ 50

void setup() {
  Serial.begin(9600);           // initialize serial communications

  pwm.begin();
  pwm.setOscillatorFrequency(27000000);
  pwm.setPWMFreq(SERVO_FREQ);

  delay(10);
}
 
void loop() {
  int angle = 0;

  // Degrees
  //    [0] = shoulderAngle
  //    [1] = armAngle
  //    [2] = wristAngle
  //    [3] = clawAngle
  
  if (Serial.available() > 0) {                   // tells if there's a serialport available
    int inByte = Serial.read();                 // reads serial port
    Serial.write(inByte);                    // send it back out as raw binary                        
    pwm.setPWM(0, 0, angleToPulse(inByte));     // use it to set the servo connected to 0
    
//    int inByte[4] = { Serial.read() };
//    Serial.write(inByte[0]);
//    Serial.write(inByte[1]);
//    Serial.write(inByte[2]);
//    Serial.write(inByte[3]);
    
    // sets each servo according to the values on an array imported from p5.js
//    pwm.setPWM(1, 0, angleToPulse(inByte[0]));
//    pwm.setPWM(1, 0, angleToPulse(inByte[1]));
//    pwm.setPWM(2, 0, angleToPulse(inByte[2]));
//    pwm.setPWM(3, 0, angleToPulse(inByte[3]));
  }
}


// intakes a degree and returns the pulse width
int angleToPulse(int degree) {
  int pulse = map(degree, 0, 180, SERVOMIN, SERVOMAX);
  Serial.print("Angle: "); Serial.print(degree);
  Serial.print(" pulse: "); Serial.println(pulse);
  return pulse;
}
