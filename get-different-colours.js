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
    // XXX: dummy code
    return Array(n).fill(rootColour);
}