/*
 * Colour Distance
 * Copyright (C) 2021 Joshua Saxby
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License v3
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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

// Source:
// http://extremelearning.com.au/how-to-evenly-distribute-points-on-a-sphere-more-effectively-than-the-canonical-fibonacci-lattice/#more-3069
// picks n equidistant points on the face of a sphere
function* coordsGenerator(n) {
    let goldenRatio = (1 + Math.pow(5, 0.5)) / 2;
    for (let i = 0; i < n; i++) {
        let theta = 2 * Math.PI * i / goldenRatio;
        let phi = Math.acos(1 - 2 * (i + 0.5) / n);
        yield [theta, phi];
    }
}

function randomCoords() {
    // pick "random" co-ords
    return [rand() / RAND_MAX * Math.PI, -Math.PI + (rand() / RAND_MAX * Math.PI * 2)];
}

/*
 * @param c Colour to get colours different from
 * @param d Distance from c that returned colours should be
 * @param n how many colours to generate
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
    let differentColours = new Set();
    /*
     * cast rays from c with distance d
     * --all rays that land in valid places are our colours
     */
    for (let [theta, phi] of coordsGenerator(n)) {
        // get ray as xyz delta
        let ray = sphericalToCartesian(d, theta, phi);
        // translate colour along this delta into target
        let target = [
            lab.l + ray.x,
            lab.a + ray.y,
            lab.b + ray.z
        ];
        if (colourInRange(...target)) {
            differentColours.add(new LAB(...target).rgb.toString());
        }
    }
    /*
     * if we didn't generate enough colours to fill the set, try picking some
     * more, randomly
     */
    console.log("Picked: " + differentColours.size);
    let tries = 0;
    // seed MPRNG for repeatable "random" results
    srand(0);
    while (differentColours.size < n) {
        let [theta, phi] = randomCoords();
        // get ray as xyz delta
        let ray = sphericalToCartesian(d, theta, phi);
        // translate colour along this delta into target
        let target = [
            lab.l + ray.x,
            lab.a + ray.y,
            lab.b + ray.z
        ];
        if (colourInRange(...target)) {
            differentColours.add(new LAB(...target).rgb.toString());
        }
        // this will prevent us from locking up, bail if tried too much
        tries++;
        if (tries >= GIVE_UP_AFTER) {
            break;
        }
    }
    // unpack set into array
    return [...differentColours];
}
