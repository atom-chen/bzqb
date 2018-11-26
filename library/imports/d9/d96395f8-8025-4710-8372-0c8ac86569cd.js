"use strict";
cc._RF.push(module, 'd9639X4gCVHEINyDIrIZWnN', 'nodeBufferReader');
// framework/lib/jszip/nodeBufferReader.js

'use strict';

var Uint8ArrayReader = require('./uint8ArrayReader');

function NodeBufferReader(data) {
    this.data = data;
    this.length = this.data.length;
    this.index = 0;
}
NodeBufferReader.prototype = new Uint8ArrayReader();

/**
 * @see DataReader.readData
 */
NodeBufferReader.prototype.readData = function (size) {
    this.checkOffset(size);
    var result = this.data.slice(this.index, this.index + size);
    this.index += size;
    return result;
};
module.exports = NodeBufferReader;

cc._RF.pop();