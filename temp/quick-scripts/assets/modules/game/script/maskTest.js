(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/maskTest.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '81b7bRYcJhBba0bYskxMcKC', 'maskTest', __filename);
// modules/game/script/maskTest.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maskNode = null;
        _this.frame = null;
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.start = function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.addPoint, this);
        // this._addCircle({
        // 	x:0,
        // 	y:0
        // });
    };
    NewClass.prototype.onDestroy = function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.addPoint, this);
    };
    NewClass.prototype.addPoint = function (event) {
        var point = event.touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        this._addCircle(point);
    };
    NewClass.prototype._addCircle = function (point) {
        console.log("point", point);
        var node = new cc.Node();
        node.addComponent(cc.Sprite).spriteFrame = this.frame;
        node.x = point.x;
        node.y = point.y;
        node.width = 350;
        node.height = 250;
        node.parent = this.maskNode.node;
        var stencil = this.maskNode._graphics;
        console.log(stencil);
        stencil.lineWidth = 10;
        stencil.fillColor.fromHEX('#ff0000');
        stencil.ellipse(point.x, point.y, 150, 100);
        stencil.stroke();
        stencil.fill();
        if (!CC_JSB) {
            cc.renderer.childrenOrderDirty = true;
        }
    };
    __decorate([
        property(cc.Mask)
    ], NewClass.prototype, "maskNode", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], NewClass.prototype, "frame", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

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
        //# sourceMappingURL=maskTest.js.map
        