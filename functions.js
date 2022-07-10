export function scalePoints(point) {
    let v = createVector(point.x*width, point.y*height);
    return v;
}

export function calculateDistance(v1, v2) {
    let d = sqrt(sq(v2.x - v1.x) + sq(v2.y - v1.y));
    return d;
}

export function findMidpoint(v1, v2) {
    let v3 = createVector((v1.x + v2.x)/2, (v1.y + v2.y)/2);
    return v3;
}

export function pythagorean(a, b) {
    let c = sqrt(sq(a)+sq(b));
    return c;
}

export function calculateAngle(a, b, c) {
    // Use this formula to calculate an angle of a non-right angle where the angles are unknown
    // a = the side across from the angle
    let A = acos((sq(b)+sq(c)-sq(a))/(2*b*c));
    return A;
}