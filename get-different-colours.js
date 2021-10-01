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

function colourInRange(rgbOnly, l, a, b) {
    if (rgbOnly) {
        // convert to RGB and check if in RGB gamut
        return new LAB(l, a, b).rgb.isExact;
    } else {
        // otherwise check it's in the LAB gamut
        return (
            LAB.L_MIN_VALUE <= l && l <= LAB.L_MAX_VALUE &&
            LAB.AB_MIN_VALUE <= a && a <= LAB.AB_MAX_VALUE &&
            LAB.AB_MIN_VALUE <= b && b <= LAB.AB_MAX_VALUE
        );
    }
}

// Source:
// http://extremelearning.com.au/how-to-evenly-distribute-points-on-a-sphere-more-effectively-than-the-canonical-fibonacci-lattice/#more-3069
// picks n equidistant points on the face of a sphere
function* goldenSpiral(n) {
    let goldenRatio = (1 + Math.pow(5, 0.5)) / 2;
    for (let i = 0; i < n; i++) {
        let theta = 2 * Math.PI * i / goldenRatio;
        let phi = Math.acos(1 - 2 * (i + 0.5) / n);
        yield [theta, phi];
    }
}

/*
 * returns new LAB colour as array of units, based on origin LAB colour cast
 * along ray described by polar coördinates (r, theta, phi)
 */
function castRay(origin, r, theta, phi) {
    // get ray as xyz delta
    let ray = sphericalToCartesian(r, theta, phi);
    // translate colour along this delta into target
    return [
        origin.l + ray.x,
        origin.a + ray.y,
        origin.b + ray.z
    ];
}

// maximmum number of attempts to adjust the sample size to limit number of colours
const MAX_TRIES = 5;

function* colourGenerator(origin, rgbOnly, d, n, samples) {
    /*
     * do a trial run of the golden-spiral generator to work out what proportion
     * of points on the sphere are in range
     */
    let pointsInRange = 0;
    for (let [theta, phi] of goldenSpiral(samples)) {
        let target = castRay(origin, d, theta, phi);
        if (colourInRange(rgbOnly, ...target)) {
            pointsInRange++;
        }
    }
    // fallback to random sampling if no points in range
    if (pointsInRange == 0) { return; }
    // otherwise, calculate number of samples needed to ensure n samples are taken
    let samplesNeeded = Math.round(n / (pointsInRange / samples));
    // never exceed maximum samples count
    let samplesToTake = Math.min(samplesNeeded, samples);
    /*
     * even this proportional oversample sometimes overshoots or undershoots the
     * exact number of required colours --progressively keep refining the sample
     * size when this happens until we no longer have excess colours
     * --we save the results of each run in case it was exact, to prevent
     * having to recalculate the points yet again
     */
    let coloursThisRun;
    let samplesThisRun = samplesToTake;
    let tries = 0;
    do {
        tries++;
        coloursThisRun = new Set();
        // yield colours from golden spiral generator on this modified sample size
        for (let [theta, phi] of goldenSpiral(samplesThisRun)) {
            let target = castRay(origin, d, theta, phi);
            if (colourInRange(rgbOnly, ...target)) {
                coloursThisRun.add(new LAB(...target).hash);
            }
        }
        // adjust sample size in case of over-shoot
        samplesThisRun *= n / coloursThisRun.size;
        // limit samples taken to no more than max
        samplesThisRun = Math.min(samplesThisRun, samples);
        // only try again if not tried too many times and there're too many colours
    } while (tries < MAX_TRIES && coloursThisRun.size > n);
    // now, unhash each colour in turn and yield it
    for (let c of coloursThisRun) {
        yield LAB.fromHash(c);
    }
}

/*
 * @param c Colour to get colours different from
 * @param rgbOnly Whether to only return colours that are within the RGB gamut
 * or not.
 * @param d Distance from c that returned colours should be
 * @param n how many colours to generate
 * @param samples maximum number of samples to use for accurate raycasting
 * (must be not less than n)
 * @returns null when there are no colours in range that satisfy distance d from
 * colour C
 * @returns array of values of length 0..n, with any values being string CSS
 * RGB hex colours. If length of array is 0, no colours were found before giving up.
 */
export default function(c, rgbOnly, d, n, samples=n * 1000) {
    // bail if samples < n
    if (samples < n) { return null; }
    // copy input colour
    let rootColour = `${c}`;
    let rgb = RGB.fromString(rootColour);
    // convert to LAB
    let lab = rgb.lab;
    // check if desired distance is achievable before doing any spherical trig
    if (!distanceAchievable(lab, d)) { return null; }
    // generate a set of colours, unpacked from generator into an array
    return Array.from(colourGenerator(lab, rgbOnly, d, n, samples));
}
