/*
 * This is an implementation of the mediocre psuedo-random number generator
 * given as an example for rand() in the C standard.
 *
 * It's not cryptographically secure or pretty good in its random output,
 * however it is seedable unlike the stock PRNG we get with JavaScript.
 */

let randNext = 1;

export const RAND_MAX = 32767;

export function rand() {
    // don't forget to enforce "unsigned" 32-bit overflow wraparound!
    randNext = (randNext * 1103515245 + 12345) % 4_294_967_296;
    return (randNext / 65536) % 32768;
}

export function srand(seed) {
    // all we do is make sure it's an integer and positive
    randNext = Math.abs(parseInt(seed));
}
