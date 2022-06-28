// Particle system from CodingTrain
export default class Particle {
    constructor(point, lifetime) {
        this.point = point;
    //   this.vel = p5.Vector.random2D();
    //   this.vel.mult(random(0.5, 3));
    //   this.acc = createVector(0, 0);
        this.r = 10;
        this.lifetime = lifetime;
    }
  
    finished() {
      return this.lifetime < 0;
    }
  
    // applyForce(force) {
    //   this.acc.add(force);
    // }
  
    // edges() {
    //   if (this.pos.y >= height) {
    //     this.pos.y = height;
    //     this.vel.y *= -1;
    //   }
  
    //   if (this.pos.x >= width) {
    //     this.pos.x = width;
    //     this.vel.x *= -1;
    //   }
    // }
  
    update() {
    //   this.vel.add(this.acc);
    //   this.pos.add(this.vel);
    //   this.acc.set(0, 0);
        console.log(this.lifetime);
        this.lifetime -= 20;
    }
  
    draw() {
        push();
        for (let hand = 0; hand < this.point.length; hand++) {
            stroke(240, 100, 100, this.lifetime);
            strokeWeight(2);
            fill(240, 100, 100, this.lifetime);
            
            ellipse(this.point[hand].x, this.point[hand].y, 10);
        }
        pop();
    }
}