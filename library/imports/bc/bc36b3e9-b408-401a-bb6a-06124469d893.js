"use strict";
cc._RF.push(module, 'bc36bPptAhAGrtqBhJEadiT', 'BaseView');
// framework/baseClass/BaseView.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ModuleMgr_1 = require("../modules/ModuleMgr");
var Loader_1 = require("../modules/Loader");
/** @description 视图基类 */
var BaseView = /** @class */ (function () {
    function BaseView(model) {
        this.model = model;
    }
    BaseView.prototype.initUi = function () {
    };
    /**
     * 加载图片
     * @param imageName 图片名
     * @param isPublic 是否是公共的，默认不是
     */
    BaseView.prototype.loadImage = function (imageName, isPublic) {
        if (isPublic === void 0) { isPublic = false; }
        return ModuleMgr_1.default.getInstance().loadImage(imageName, isPublic);
    };
    BaseView.prototype.getImageSync = function (imageName, isPublic) {
        if (isPublic === void 0) { isPublic = false; }
        var url = ModuleMgr_1.default.getInstance().getResUrl("image", imageName, isPublic);
        return Loader_1.default.getInstance().getRes(url, cc.SpriteFrame);
    };
    /**
     * 创建子节点
     * @param prefab 需要实例化的预制或需要复制的节点
     * @param parentNode 父节点
     * @param zIndex z轴，默认为0
     */
    BaseView.prototype.addPrefabNode = function (prefab, parentNode, zIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        var prefabNode = cc.instantiate(prefab);
        prefabNode.parent = parentNode;
        prefabNode.zIndex = zIndex;
        return prefabNode;
    };
    /**
     * 添加点击吞噬遮罩
     * @param black 是否是黑色，默认是
     */
    BaseView.prototype.addGrayLayer = function (black) {
        if (black === void 0) { black = true; }
        if (cc.isValid(this.node, true)) {
            this._grayLayer = new cc.Node();
            if (black) {
                this._grayLayer.color = cc.Color.BLACK;
                this._grayLayer.opacity = 150;
                var sprite_1 = this._grayLayer.addComponent(cc.Sprite);
                sprite_1.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.loadImage("singleColor", true).then(function (spF) {
                    sprite_1.spriteFrame = spF;
                });
            }
            this._grayLayer.parent = this.node;
            var size = cc.view.getVisibleSize();
            this._grayLayer.width = size.width;
            this._grayLayer.height = size.height;
            this._grayLayer.zIndex = -1;
            this._grayLayer.addComponent(cc.BlockInputEvents);
        }
    };
    /**
     * 字符串截取
     * @param content 内容
     * @param len 需要的长度
     */
    BaseView.prototype.cutString = function (content, len) {
        if (content.length > len) {
            return content.slice(0, len) + "...";
        }
        return content;
    };
    /**
     * 字符串转换
     * @param content 内容
     * @param keyword 关键字
     * @param ReplaceWords 替换字数组
     */
    BaseView.prototype.stringReplace = function (content, keyword, ReplaceWords) {
        for (var i = 0; i < ReplaceWords.length; i++) {
            content = content.replace(keyword, ReplaceWords[i]);
        }
        return content;
    };
    /**
     * 数字省略
     * @param nub 数字
     */
    BaseView.prototype.numberEllipsis = function (num) {
        var output = null;
        if (num >= 100000) {
            output = Math.floor(num / 1000).toString() + "k";
        }
        else {
            output = num.toString();
        }
        return output;
    };
    return BaseView;
}());
exports.default = BaseView;

cc._RF.pop();