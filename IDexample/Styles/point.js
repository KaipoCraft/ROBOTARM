export default class Point {
  
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 20;
      this.id = noise(random(1000)) * 100;
      this.color = color(
        sin(this.x/70 + this.y/3) * 127 + 127, 
        sin(this.x/70 + this.y/3+1) * 127 + 127, 
        sin(this.x/70 + this.y/1+2) * 127 + 127
      );
      //this.image = loadImage('../logo.svg');
    }
    
    draw() {
        //image(this.image, this.x, this.y);
      
        this.y += this.id / 10;
        if(this.y > height*4) this.y = -height*4;
  
        push();
            translate(this.x + cos(frameCount * 0.001 + this.id) * 10, this.y + sin(frameCount * 0.001 + this.id) * 10);
        
            // draw geometry
        
            ellipseMode(CENTER);
            fill(this.color);
            ellipse(0, 0, this.radius);
        pop();
    }

    finished() {
      return this.y > height + this.radius;
    }
}