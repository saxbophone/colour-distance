function RGBToLAB(rgbArr) {
    // TODO: implement properly
    return rgbArr.slice();
}

function LABToRGB(labArr) {
    // TODO: implement properly
    return labArr.slice();
}

class RGB {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
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

    // convert back to CSS hex colour string
    toString() {
        // convert each channel to string and pad if needed
        let redString = this.red.toString(16);
        if (redString.length == 1) { redString = '0' + redString; }
        let greenString = this.green.toString(16);
        if (greenString.length == 1) { greenString = '0' + greenString; }
        let blueString = this.blue.toString(16);
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
    constructor(l, a, b) {
        this.lightness = l;
        this.aComponent = a;
        this.bComponent = b;
    }

    get l() { return this.lightness; }
    get a() { return this.aComponent; }
    get b() { return this.bComponent; }

    // XXX: for debugging only
    toString() {
        return `LAB { ${this.l}, ${this.a}, ${this.b} }`;
    }

    get rgb() {
        // use module-private helper function to convert
        let rgbArr = LABToRGB([this.l, this.a, this.b]);
        return new RGB(...rgbArr);
    }
};

export { RGB, LAB };
