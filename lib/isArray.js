const isNumber = require('./isNumeric');

const isInteger = num => isNumber(num, "4");

module.exports = {
    isIntegerArray : arr => {
        const numarr = arr.split(',');
        if(numarr.every(isInteger)) return true;
        else return false;
    },
    parseIntegerArray : arr => {
        const numarr = arr.split(',');
        numarr.forEach((element, idx) => numarr[idx] = parseInt(element, 10));
        return numarr;
    }
}