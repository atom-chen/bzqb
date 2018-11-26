"use strict";
cc._RF.push(module, '076c24xW2dDPoNmlTtLqLXW', 'BaseModel');
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