import { RGB, LAB } from './colour-spaces.js';
import { RAND_MAX, rand, srand } from './rand.js';

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

function pickRandom(min, max) {
    // refuse when not min <= max
    if (!(min <= max)) {
        return NaN;
    }
    let range = max - min;
    return min + (rand() / RAND_MAX * range);
}

function sphericalToCartesian(r, theta, phi) {
    return {
        x: r * Math.cos(phi) * Math.sin(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(theta),
    };
}

function colourInRange(l, a, b) {
    return (
        LAB.L_MIN_VALUE <= l && l <= LAB.L_MAX_VALUE &&
        LAB.AB_MIN_VALUE <= a && a <= LAB.AB_MAX_VALUE &&
        LAB.AB_MIN_VALUE <= b && b <= LAB.AB_MAX_VALUE
    );
}

// prevents lock-ups in case never find any rays
const GIVE_UP_AFTER = 750; // double the theoretical maximum distance

/*
 * @param c Colour to get colours different from
 * @param d Distance from c that returned colours should be
 * @param n Number of colours to return, if possible
 * @returns null when there are no colours in range that satisfy distance d from
 * colour C
 * @returns array of values of length 0..n, with any values being string CSS
 * RGB hex colours. If length of array is 0, no colours were found before giving up.
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
    /*
     * cast n many rays from c with distance d
     * --all rays that land in valid places are our colours
     */
    let differentColours = new Set();
    /*
     * seed the MPRNG to the same value so we know the results will be the same
     * for repeat occurences of the same inputs
     */
    srand(0);
    for (let i = 0; i < n; i++) {
        let target = null;
        let tries = 0;
        do {
            // bail if run for too long
            if (tries >= GIVE_UP_AFTER) {
                break;
            }
            // keep trying until we cast a ray to a colour that is in range
            let theta = pickRandom(0, Math.PI);
            let phi = pickRandom(-Math.PI, Math.PI);
            // get ray as xyz delta
            let ray = sphericalToCartesian(d, theta, phi);
            // translate colour along this delta into target
            target = [
                lab.l + ray.x,
                lab.a + ray.y,
                lab.b + ray.z
            ];
            tries++;
        } while (!colourInRange(...target));
        // if target is a valid colour, convert to rgb string
        if (target) {
            differentColours.add(new LAB(...target).rgb.toString());
        }
    }
    // unpack set into array
    return [...differentColours];
}
