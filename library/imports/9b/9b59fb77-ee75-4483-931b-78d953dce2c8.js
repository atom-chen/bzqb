"use strict";
cc._RF.push(module, '9b59ft37nVEg5MbeNlT3OLI', 'nodeBuffer');
// framework/lib/jszip/nodeBuffer.js

'use strict';

module.exports = function (data, encoding) {
    return new Buffer(data, encoding);
};
module.exports.test = function (b) {
    return Buffer.isBuffer(b);
};

cc._RF.pop();