 // Adafruit Servo Driver Library: https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

// Goal = to make a servo react to serial data from p5js
// Calibrate the servos to find SERVOMIN and SERVOMAX
// Use the "map()" function to translate to degrees
// pulselength = map(degrees, 0, 180, SERVOMIN, SERVOMAX)

// Create an "update angle" function
// This function will run through each of the servos and update their position gradually
// Not sure how to make multiple servos move at once - ask Zack

// Figure out how to assign different measurements on the hand to different servos

// https://stackoverflow.com/questions/14265581/parse-split-a-string-in-c-using-string-delimiter-standard-c

// Troubleshooting: for some reason the servos get confused every now and then?

#include <Wire.h>
#include <Servo.h>
#include <Adafruit_PWMServoDriver.h>

//Servo myservo;
//int pos = 0;
int ar[6] = { 0, 0, 0, 0, 0, 0 };

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

#define SERVOMIN 70     // Min for the larger servo
#define SERVOMAX 505    // Max for the larger servo
#define SMSERVOMIN 100  // Min for the smaller servo
#define SMSERVOMAX 470  // Max for the smaller servo
#define SERVO_FREQ 50


void setup() {
  Serial.begin(9600);           // initialize serial communications
  Serial.setTimeout(10);       // sets the amount of time the servos refresh

  pwm.begin();
  pwm.setOscillatorFrequency(27000000);
  pwm.setPWMFreq(SERVO_FREQ);

  pwm.setPWM(2, 0, angleToPulse(150));
  pwm.setPWM(3, 0, angleToPulse(150));
  
  delay(10);
} 
 
void loop() {
  // Degrees
  //    [0] = clawAngle
  //    [1] = wristAngle - 
  //    [2] = armAngle1 - min(65) max(165)
  //    [3] = armAngle2 - min(130) max(165)
  //    [3] = baseAngle - 
  
  if (Serial.available() > 0) {                 // tells if there's a serialport available
    for (int i = 0; i <= 5; i++) {
      //if (Serial.parseInt() > 0) {
        ar[i] = Serial.parseInt();
        
        Serial.print("Servo ");Serial.print(i+1);Serial.print(" = ");Serial.print(ar[i]);Serial.print("\n");   
        
        if (i <= 1) {
          pwm.setPWM(11+i, 0, angleToPulseSM(ar[i]));   // runs through the servos and sends each measurement to each
        } else {
          pwm.setPWM(11+i, 0, angleToPulse(ar[i]));
        }
    }
  }
}


// intakes a degree and returns the pulse width
int angleToPulse(int degree) {
  int pulse = map(degree, 0, 180, SERVOMIN, SERVOMAX);
  return pulse;
}

int angleToPulseSM(int degree) {
  int pulse = map(degree, 0, 180, SMSERVOMIN, SMSERVOMAX);
  return pulse;
}
