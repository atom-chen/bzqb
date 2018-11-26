(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/baseClass/BaseModel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '076c24xW2dDPoNmlTtLqLXW', 'BaseModel', __filename);
// framework/baseClass/BaseModel.ts

Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel = /** @class */ (function () {
    function BaseModel() {
    }
    /**
    * 字符串转换
    * @param content 内容
    * @param keyword 关键字
    * @param ReplaceWords 替换字数组
    */
    BaseModel.prototype.stringReplace = function (content, keyword, ReplaceWords) {
        for (var i = 0; i < ReplaceWords.length; i++) {
            content = content.replace(keyword, ReplaceWords[i]);
        }
        return content;
    };
    return BaseModel;
}());
exports.default = BaseModel;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=BaseModel.js.map
        