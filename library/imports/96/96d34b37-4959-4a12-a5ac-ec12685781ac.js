"use strict";
cc._RF.push(module, '96d34s3SVlKEqWs7BJoV4Gs', 'load');
// framework/lib/jszip/load.js

'use strict';

var base64 = require('./base64');
var ZipEntries = require('./zipEntries');
module.exports = function (data, options) {
    var files, zipEntries, i, input;
    options = options || {};
    if (options.base64) {
        data = base64.decode(data);
    }

    zipEntries = new ZipEntries(data, options);
    files = zipEntries.files;
    for (i = 0; i < files.length; i++) {
        input = files[i];
        this.file(input.fileName, input.decompressed, {
            binary: true,
            optimizedBinaryString: true,
            date: input.date,
            dir: input.dir,
            comment: input.fileComment.length ? input.fileComment : null,
            unixPermissions: input.unixPermissions,
            dosPermissions: input.dosPermissions,
            createFolders: options.createFolders
        });
    }
    if (zipEntries.zipComment.length) {
        this.comment = zipEntries.zipComment;
    }

    return this;
};

cc._RF.pop();