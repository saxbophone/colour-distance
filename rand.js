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
