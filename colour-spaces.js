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

// XYZ reference values
const XYZ_X_REF_VALUE = 95.047;
const XYZ_Y_REF_VALUE = 100.0;
const XYZ_Z_REF_VALUE = 108.883;

// XXX: modifies its input!
function scaleDownRGB(rgb) {
    rgb[0] /= 255;
    rgb[1] /= 255;
    rgb[2] /= 255;
}

function convertRGBForXYZ(c) {
    return (c > 0.04045) ? Math.pow((c + 0.055) / 1.055, 2.4) : (c / 12.92);
}

function RGBToXYZ(rgb) {
    scaleDownRGB(rgb); // scale down each RGB channel
    // translate each channel
    rgb[0] = convertRGBForXYZ(rgb[0]) * 100; // r
    rgb[1] = convertRGBForXYZ(rgb[1]) * 100; // g
    rgb[2] = convertRGBForXYZ(rgb[2]) * 100; // b
    // apply matrix transforms
    return [
        rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805,
        rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722,
        rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505,
    ];
}

function convertXYZForLAB(c) {
  // converted component needs the cube root of input if over a given size
  return (c > 0.008856) ? Math.pow(c, (1.0 / 3)) : (7.787 * c) + (16.0 / 116);
}

function XYZToLAB(xyz) {
    // skew and convert xyz values
    xyz[0] = convertXYZForLAB(xyz[0] / XYZ_X_REF_VALUE);
    xyz[1] = convertXYZForLAB(xyz[1] / XYZ_Y_REF_VALUE);
    xyz[2] = convertXYZForLAB(xyz[2] / XYZ_Z_REF_VALUE);
    // convert to LAB ranges
    return [
        (116 * xyz[1]) - 16,
        500 * (xyz[0] - xyz[1]),
        200 * (xyz[1] - xyz[2]),
    ];
}

function RGBToLAB(rgbArr) {
    // convert via XYZ as an intermediate
    let xyzArr = RGBToXYZ(rgbArr);
    let labArr = XYZToLAB(xyzArr);
    return labArr;
}

// private helper function for LABToXYZ
function convertLABForXYZ(c) {
    // get c cubed
    let cCubed = Math.pow(c, 3);
    // converted component depends on size of cubed component
    return (cCubed > 0.008856) ? cCubed : ((c - 16 / 116.0) / 7.787);
}

function LABToXYZ(lab) {
    // skew input values
    let y = (lab[0] + 16.0) / 116.0;
    let x = lab[1] / 500.0 + y;
    let z = y - lab[2] / 200.0;
    // normalise components and adjust for observer calibration
    return [
        XYZ_X_REF_VALUE * convertLABForXYZ(x),
        XYZ_Y_REF_VALUE * convertLABForXYZ(y),
        XYZ_Z_REF_VALUE * convertLABForXYZ(z),
    ];
}

function convertXYZForRGB(c) {
    return (c > 0.0031308) ? (1.055 * Math.pow(c, 1 / 2.4) - 0.055) : (12.92 * c);
}

// Algorithm: http://www.easyrgb.com/index.php?X=MATH&H=01#text1
function XYZToRGB(xyz) {
    // shrink larger numbers downs
    let x = xyz[0] / 100;
    let y = xyz[1] / 100;
    let z = xyz[2] / 100;
    // multiplex the values
    let r = x *  3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y *  1.8758 + z *  0.0415;
    let b = x *  0.0557 + y * -0.2040 + z *  1.0570;
    // convert components and upscale
    return [
        convertXYZForRGB(r) * 255,
        convertXYZForRGB(g) * 255,
        convertXYZForRGB(b) * 255,
    ];
}

function LABToRGB(labArr) {
    // convert via XYZ as an intermediate
    let xyzArr = LABToXYZ(labArr);
    let rgbArr = XYZToRGB(xyzArr);
    return rgbArr;
}

class RGB {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.isExact =
            (0 <= Math.round(r) && Math.round(r) <= 255) &&
            (0 <= Math.round(g) && Math.round(g) <= 255) &&
            (0 <= Math.round(b) && Math.round(b) <= 255);
    }

    // parses from CSS hex colour e.g. "#rrggbb"
    static fromString(str) {
        // XXX: no validation, better trust your inputs!
        return new RGB(
            parseInt(str.substring(1, 3), 16),
            parseInt(str.substring(3, 5), 16),
            parseInt(str.substring(5, 7), 16),
        );
    }

    get r() { return this.red; }
    get g() { return this.green; }
    get b() { return this.blue; }

    // clamp and cast all channels to int
    get normalised() {
        return new RGB(
            Math.min(255, Math.max(0, Math.round(this.red))),
            Math.min(255, Math.max(0, Math.round(this.green))),
            Math.min(255, Math.max(0, Math.round(this.blue)))
        );
    }

    // convert back to CSS hex colour string
    toString() {
        // normalise and convert each channel to string and pad if needed
        let norm = this.normalised;
        let redString = Math.round(norm.red).toString(16);
        if (redString.length == 1) { redString = '0' + redString; }
        let greenString = Math.round(norm.green).toString(16);
        if (greenString.length == 1) { greenString = '0' + greenString; }
        let blueString = Math.round(norm.blue).toString(16);
        if (blueString.length == 1) { blueString = '0' + blueString; }
        return `#${redString}${greenString}${blueString}`;
    }

    get lab() {
        // use module-private helper function to convert
        let labArr = RGBToLAB([this.r, this.g, this.b]);
        return new LAB(...labArr);
    }
};

class LAB {
    static get L_MIN_VALUE() { return 0; }
    static get L_MAX_VALUE() { return 100; }
    static get AB_MIN_VALUE() { return -128; }
    static get AB_MAX_VALUE() { return 128; }

    constructor(l, a, b) {
        this.lightness = Math.min(LAB.L_MAX_VALUE, Math.max(LAB.L_MIN_VALUE, l));
        this.aComponent = Math.min(LAB.AB_MAX_VALUE, Math.max(LAB.AB_MIN_VALUE, a));
        this.bComponent = Math.min(LAB.AB_MAX_VALUE, Math.max(LAB.AB_MIN_VALUE, b));
    }

    static fromHash(hash) {
        let obj = JSON.parse(hash);
        return new LAB(obj.lightness, obj.aComponent, obj.bComponent);
    }

    get l() { return this.lightness; }
    get a() { return this.aComponent; }
    get b() { return this.bComponent; }

    // HTML output of LAB text with newlines, with values rounded
    toString() {
        return `LAB ${Math.round(this.l)}<br/>${Math.round(this.a)}<br/>${Math.round(this.b)}`;
    }

    get rgb() {
        // use module-private helper function to convert
        let rgbArr = LABToRGB([this.l, this.a, this.b]);
        return new RGB(...rgbArr);
    }

    get hash() {
        return JSON.stringify(this);
    }
};

export { RGB, LAB };
