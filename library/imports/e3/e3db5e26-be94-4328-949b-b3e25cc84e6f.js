"use strict";
cc._RF.push(module, 'e3db54mvpRDKJSbs+JcyE5v', 'uint8ArrayWriter');
// framework/lib/jszip/uint8ArrayWriter.js

'use strict';

var utils = require('./utils');

/**
 * An object to write any content to an Uint8Array.
 * @constructor
 * @param {number} length The length of the array.
 */
var Uint8ArrayWriter = function Uint8ArrayWriter(length) {
    this.data = new Uint8Array(length);
    this.index = 0;
};
Uint8ArrayWriter.prototype = {
    /**
     * Append any content to the current array.
     * @param {Object} input the content to add.
     */
    append: function append(input) {
        if (input.length !== 0) {
            // with an empty Uint8Array, Opera fails with a "Offset larger than array size"
            input = utils.transformTo("uint8array", input);
            this.data.set(input, this.index);
            this.index += input.length;
        }
    },
    /**
     * Finalize the construction an return the result.
     * @return {Uint8Array} the generated array.
     */
    finalize: function finalize() {
        return this.data;
    }
};

module.exports = Uint8ArrayWriter;

cc._RF.pop();