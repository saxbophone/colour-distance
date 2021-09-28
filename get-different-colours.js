import { RGB, LAB } from './colour-spaces.js';

/*
 * @returns 3D hypotenuse over x, y and z
 * @todo Move into a separate Math module for reuse elsewhere in codebase
 */
function hypotenuse3D(x, y, z) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
}

/*
 * @param f LAB Colour to check if distance is in range for
 * @param r Desired distance to plot a LAB Colour from f
 * @returns true if there are colours in range that are r distance away from f
 * @returns false if there are no colours in range
 */
function distanceAchievable(f, r) {
    // create a new LAB colour representing the delta from f to furthest LAB colour
    let delta = new LAB(
        Math.max(Math.abs(LAB.L_MIN_VALUE - f.l), Math.abs(LAB.L_MAX_VALUE - f.l)),
        Math.max(Math.abs(LAB.AB_MIN_VALUE - f.a), Math.abs(LAB.AB_MAX_VALUE - f.a)),
        Math.max(Math.abs(LAB.AB_MIN_VALUE - f.b), Math.abs(LAB.AB_MAX_VALUE - f.b))
    );
    // calculate maximum distance using 3D hypotenuse from this delta
    let distance = hypotenuse3D(delta.l, delta.a, delta.b);
    // distance is achievable if r is not greater than it
    return r <= distance;
}

/*
 * @param c Colour to get colours different from
 * @param d Distance from c that returned colours should be
 * @param n Number of colours to return, if possible
 * @returns null when there are no colours in range that satisfy distance d from
 * colour C
 * @returns array of 16 values, any of which can be either a string describing
 * a colour or undefined, when there are colours in range.
 */
export default function(c, d, n) {
    // copy input colour
    let rootColour = `${c}`;
    let rgb = RGB.fromString(rootColour);
    // convert to LAB
    let lab = rgb.lab;
    // check if desired distance is achievable before doing any spherical trig
    if (!distanceAchievable(lab, d)) {
        return null;
    }
    // XXX: convert back to RGB
    let outColour = lab.rgb.toString();
    return Array(n).fill(outColour);
}
