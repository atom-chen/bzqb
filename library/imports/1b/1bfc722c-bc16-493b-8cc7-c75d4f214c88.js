"use strict";
cc._RF.push(module, '1bfc7IsvBZJO4zHx11PIUyI', 'Loader');
// framework/modules/Loader.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**加载管理 */
var Loader = /** @class */ (function () {
    function Loader() {
    }
    Loader.getInstance = function () {
        return Loader._instance;
    };
    /**
     * 加载预制
     * @param url 预制路径
     */
    Loader.prototype.loadPrefab = function (url) {
        return this.loadRes(url, cc.Prefab);
    };
    /**
     * 加载图片
     * @param url 图片路径
     */
    Loader.prototype.loadImage = function (url) {
        return this.loadRes(url, cc.SpriteFrame);
    };
    /**
     * 加载配置
     * @param url 配置路径
     */
    Loader.prototype.loadConfig = function (url) {
        return this.loadRes(url, cc.JsonAsset);
    };
    Loader.prototype.loadQueue = function (obj) {
        var paths = obj.paths, progress = obj.progress, complete = obj.complete;
        var totalFileCount = paths.length;
        var loadFileCount = 0;
        for (var i = 0; i < totalFileCount; ++i) {
            var _a = paths[i], url = _a.url, type = _a.type;
            this.loadRes(url, type).then(function () {
                loadFileCount++;
                progress(loadFileCount / totalFileCount);
                if (loadFileCount === totalFileCount)
                    complete();
            });
        }
    };
    Loader.prototype.loadRes = function (url, type) {
        return new Promise(function (resolve, reject) {
            cc.loader.loadRes(url, type, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    Loader.prototype.getRes = function (url, type) {
        return cc.loader.getRes(url, type);
    };
    Loader.prototype.releaseRes = function (urlArr) {
        for (var i = 0; i < urlArr.length; ++i) {
            var uuids = cc.loader.getDependsRecursively(urlArr[i]);
            cc.loader.release(uuids);
        }
    };
    Loader._instance = new Loader();
    return Loader;
}());
exports.default = Loader;

cc._RF.pop();