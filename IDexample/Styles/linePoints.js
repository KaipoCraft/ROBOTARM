export default class LinePoints {
    constructor(point) {
        this.point = point;
        this.width = width;
        this.height = height;
        this.inc = 0.01;
    }


    // Use 2D perlin noise to create a "chased" object
    // Line lerps towards that point

    draw() {
        if (this.point.x != null) {
            //vertex(this.point.x, this.point.y);
            vertex(this.point.x, this.point.y);
        }
    }

    update() {
        if (this.point.x != null) {

            this.point.x += 10;

            // this.point.y += this.calcNoise();

        }
    }

    calcNoise() {
        let y;
        let xoff1 = 0;
        let xoff2 = 10000;
        let noise1 = map(noise(xoff1), 0, 1, 0, 20);
        let noise2 = map(noise(xoff2), 0, 1, -20, 0);
        y = noise1 + noise2;
        xoff1 += this.inc;
        xoff2 += this.inc;
        return y;
    }

    finished() {
        return this.point.x >= width + 20;
    }
}