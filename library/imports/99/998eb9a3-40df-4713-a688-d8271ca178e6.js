"use strict";
cc._RF.push(module, '998ebmjQN9HE6aI2CccoXjm', 'String');
// framework/lib/extension/String.js

"use strict";

String.prototype.replaceByKey = function (words) {
    return this.replace(/%\w/g, function (k) {
        return words[k];
    });
};

cc._RF.pop();