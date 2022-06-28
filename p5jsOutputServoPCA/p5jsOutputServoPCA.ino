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

#include <Wire.h>
#include <Servo.h>
#include <Adafruit_PWMServoDriver.h>

//Servo myservo;
//int pos = 0;
int ar[4] = { 0, 0, 0, 0 };

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

#define SERVOMIN 70     // Min for the larger servo
#define SERVOMAX 505    // Max for the larger servo
#define SMSERVOMIN 150  // Min for the smaller servo
#define SMSERVOMAX 600  // Max for the smaller servo
#define SERVO_FREQ 50


void setup() {
  Serial.begin(9600);           // initialize serial communications
  Serial.setTimeout(50);       // sets the amount of time the servos refresh
  
  pwm.begin();
  pwm.setOscillatorFrequency(27000000);
  pwm.setPWMFreq(SERVO_FREQ);

  delay(10);
} 
 
void loop() {
  // Degrees
  //    [0] = shoulderAngle
  //    [1] = armAngle
  //    [2] = wristAngle
  //    [3] = clawAngle
  
  if (Serial.available() > 0) {                 // tells if there's a serialport available
//    int inByte = Serial.read();                 // reads serial port
//    int inByte = Serial.parseInt();
    
    for (int i = 0; i <= 4; i++) {
      if (Serial.parseInt() > 0) {
        ar[i] = Serial.parseInt();
        
        Serial.print("Servo ");Serial.print(i+1);Serial.print(" = ");Serial.print(ar[i]);Serial.print("\n");
        //Serial.write(ar[i]);                       // send it back out as raw binary     
        //pwm.setPWM(i, 0, angleToPulse(ar[i]));
      }
    }
    
    
    
//    Serial.print(inByte);
//                       
//    pwm.setPWM(0, 0, angleToPulse(inByte));     // use it to set the servo connected to 0
  

    // #TODO function that converts incoming string to array 
    // input = string
    // output = array
    
  }
  
  pwm.setPWM(0, 0, angleToPulse(ar[0]));
  pwm.setPWM(1, 0, angleToPulse(ar[1]));
}


// intakes a degree and returns the pulse width
int angleToPulse(int degree) {
  int pulse = map(degree, 0, 180, SERVOMIN, SERVOMAX);
//  Serial.print("Angle: "); Serial.print(degree);
//  Serial.print(" pulse: "); Serial.println(pulse);
  return pulse;
}
