// TODO:
// - Cache geometry: https://www.paulwheeler.us/articles/custom-3d-geometry-in-p5js/

let numPoints = 100;
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  for(let i=0; i < numPoints; i++) {
    points.push(new Point(random(-width*4, width*4), random(-height*4, height*4)));
  }
}

function draw() {
  background(220);
  noStroke();

  for(let i=0; i < numPoints; i++) {
    points[i].draw();
  }

  if(frameCount % 600 == 100) print('frameRate: '+deltaTime);
}

class Point {
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = noise(random(1000)) * 100;
    this.color = color(
      sin(this.x/70 + this.y/3) * 127 + 127, 
      sin(this.x/70 + this.y/3+1) * 127 + 127, 
      sin(this.x/70 + this.y/1+2) * 127 + 127
    );
  }
  
  draw() {
    let cellDetail = 64;
    
    this.y += this.id / 10;
    if(this.y > height*4) this.y = -height*4;

    push();
    translate(this.x + cos(frameCount * 0.001 + this.id) * 10, this.y + sin(frameCount * 0.001 + this.id) * 10);

    // draw geometry
    // translate(this.x, this.y, 0);
    let hoffOrthoFactor = width * 2;// dist(0, 0, width, height);
    let shapeRads = 0;
    let segmentRads = TWO_PI / cellDetail;
    let rFix = hoffOrthoFactor * 0.9;
    beginShape();
    fill(this.color);

    for (let j = 0; j < cellDetail; j++) {
      let rads = segmentRads * j;
      vertex(0, 0, -rFix);
      vertex(
        hoffOrthoFactor * cos(rads), 
        hoffOrthoFactor * sin(rads), 
        -hoffOrthoFactor
      );
      vertex(
        hoffOrthoFactor * cos(rads + segmentRads), 
        hoffOrthoFactor * sin(rads + segmentRads), 
        -hoffOrthoFactor
      );
    }
    endShape();

    ellipseMode(CENTER);
    fill(255);
    // circle(0, 0, 20);
    pop();

  }
}