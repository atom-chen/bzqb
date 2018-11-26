(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/modules/ModuleMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '274bf8CJtxBjbKrQGxnVVd9', 'ModuleMgr', __filename);
// framework/modules/ModuleMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var LogMgr_1 = require("./LogMgr");
var Loader_1 = require("./Loader");
var ModuleMgr = /** @class */ (function () {
    function ModuleMgr() {
        this._pubResPaths = require("publicResPath");
        this._curResPaths = require("loginResPath");
        this._lastResPaths = null;
    }
    ModuleMgr.getInstance = function () {
        return ModuleMgr._instance;
    };
    ModuleMgr.prototype._switchPaths = function (sceneName) {
        this._lastResPaths = this._curResPaths;
        this._curResPaths = require(sceneName + "ResPath");
    };
    /**
     * 切换场景
     * @param sceneName 场景名
     */
    ModuleMgr.prototype.switchScene = function (sceneName, routeArr) {
        this._switchPaths(sceneName);
        this.showLoading({
            resPaths: this._curResPaths,
            routeArr: routeArr,
            complete: function () {
                LogMgr_1.default.getInstance().switchScene(sceneName);
                cc.director.loadScene(sceneName);
            }
        });
    };
    ModuleMgr.prototype._releaseRes = function () {
        var urlArr = [];
        for (var k in this._lastResPaths) {
            if (k == "config")
                continue;
            for (var s in this._lastResPaths[k]) {
                urlArr.push(this._lastResPaths[k][s]);
            }
        }
        Loader_1.default.getInstance().releaseRes(urlArr);
    };
    ModuleMgr.prototype.getResUrl = function (type, name, isPublic) {
        if (isPublic === void 0) { isPublic = false; }
        var resPaths = this._pubResPaths;
        if (type !== "config" && !isPublic)
            resPaths = this._curResPaths;
        return resPaths[type][name];
    };
    /**
     * 打开子模块
     * @param moduleName 模块名
     */
    ModuleMgr.prototype.openSubModule = function (moduleName, isPublic, isOnly) {
        if (isOnly === void 0) { isOnly = true; }
        return __awaiter(this, void 0, Promise, function () {
            var curScene, prefabInstance, resPaths, prefab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        curScene = cc.director.getScene();
                        prefabInstance = curScene.getChildByName(moduleName);
                        if (!(!prefabInstance || !cc.isValid(prefabInstance, true) || !isOnly)) return [3 /*break*/, 2];
                        resPaths = isPublic ? this._pubResPaths : this._curResPaths;
                        return [4 /*yield*/, Loader_1.default.getInstance().loadPrefab(resPaths.prefab[moduleName])];
                    case 1:
                        prefab = _a.sent();
                        prefabInstance = cc.instantiate(prefab);
                        prefabInstance.parent = curScene;
                        _a.label = 2;
                    case 2: return [2 /*return*/, prefabInstance.getComponent(prefabInstance.name)];
                }
            });
        });
    };
    /**
     * 加载图片
     * @param imageName 图片名
     * @param isPublic 是否是公共
     */
    ModuleMgr.prototype.loadImage = function (imageName, isPublic) {
        return __awaiter(this, void 0, Promise, function () {
            var resPaths, spriteFrame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resPaths = isPublic ? this._pubResPaths : this._curResPaths;
                        return [4 /*yield*/, Loader_1.default.getInstance().loadImage(resPaths.image[imageName])];
                    case 1:
                        spriteFrame = _a.sent();
                        return [2 /*return*/, spriteFrame];
                }
            });
        });
    };
    /**
     * 关闭模块
     * @param moduleName 模块名
     */
    ModuleMgr.prototype.closeModule = function (moduleName) {
        var instance = cc.director.getScene().getChildByName(moduleName);
        if (!instance)
            return console.log("没有打开此模块!");
        if (cc.isValid(instance))
            instance.destroy();
    };
    ModuleMgr.prototype.showLoading = function (obj) {
        var resPaths = obj.resPaths, routeArr = obj.routeArr, complete = obj.complete;
        this.openSubModule("loading", true).then(function (script) {
            script.setPreLoad({
                resPaths: resPaths,
                routeArr: routeArr,
                complete: complete
            });
        });
    };
    ModuleMgr.prototype.showMsgBox = function (obj) {
        var content = obj.content, title = obj.title, okcb = obj.okcb;
        this.openSubModule("msgBox", true).then(function (script) {
            script.init(title, content, okcb, null);
        });
    };
    ModuleMgr.prototype.showDialog = function (obj) {
        var content = obj.content, title = obj.title, okcb = obj.okcb, cancelcb = obj.cancelcb;
        this.openSubModule("msgBox", true).then(function (script) {
            script.init(title, content, okcb, cancelcb, false);
        });
    };
    ModuleMgr.prototype.showGainBox = function (arr) {
        console.log(arr);
        this.openSubModule("gainBox", true).then(function (script) {
            script.setGainData(arr);
        });
    };
    ModuleMgr.prototype.showHandleGainBox = function (data) {
        var arr = [];
        for (var key in data) {
            if (typeof data[key] == "object") {
                for (var i = 0; i < data[key].length; i++) {
                    arr.push({
                        type: key,
                        amount: data[key][i].amount,
                    });
                }
            }
            else {
                arr.push({
                    type: key,
                    amount: data[key],
                });
            }
        }
        this.showGainBox(arr);
    };
    ModuleMgr.prototype.showTipBox = function (content) {
        this.openSubModule("tipBox", true, false).then(function (script) {
            script.setContent(content);
        });
    };
    ModuleMgr.prototype.showJuhua = function () {
        this.openSubModule("juhua", true);
    };
    ModuleMgr._instance = new ModuleMgr();
    return ModuleMgr;
}());
exports.default = ModuleMgr;

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
        //# sourceMappingURL=ModuleMgr.js.map
        