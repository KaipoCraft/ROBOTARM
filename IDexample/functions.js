export function scalePoints(point) {
    let v = createVector(point.x*width, point.y*height);
    return v;
}