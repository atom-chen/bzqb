(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/modules/ServerMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '20fc1VvtF9Oy6rAh85hm4sZ', 'ServerMgr', __filename);
// framework/modules/ServerMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Loader_1 = require("../modules/Loader");
var GameNet_1 = require("../modules/GameNet");
var ServerMgr = /** @class */ (function () {
    function ServerMgr() {
        this._settingPath = 'config/localsetting';
        this._localsetting = null;
        this._servercfg = null;
        this._callback = null;
        this._enableHotUpdate = false;
        this._enableHotUpdate = cc.sys.isNative && cc.sys.isMobile;
    }
    ServerMgr.getInstance = function () {
        return this._instance;
    };
    ServerMgr.prototype.loadLoacalSetting = function (callback) {
        this._callback = callback;
        this._localsetting = Loader_1.default.getInstance().getRes(this._settingPath, cc.JsonAsset).json;
        this.loadSettingCb();
    };
    ServerMgr.prototype.loadSettingCb = function () {
        var _this = this;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var respone = xhr.responseText;
                _this._servercfg = JSON.parse(respone);
                console.log("网络配置=", _this._servercfg);
                GameNet_1.default.getInstance().setServerCfg();
                _this._callback(0);
            }
        };
        xhr.timeout = 3000;
        xhr.onerror = function () {
            console.error("下载网络配置出错!");
            _this._callback(-1);
        };
        xhr.ontimeout = function () {
            console.error("下载网络配置超时!");
            _this._callback(-1);
        };
        var URLProducttag = this._localsetting.producttag;
        if (!cc.sys.isNative && window && window.location && window.location.href) {
            URLProducttag = this.analysisURLParameter(window.location.href).args.producttag;
            // console.log("URLProducttag=", URLProducttag, data.producttag);
        }
        window['__errorReportUrl'] = this._localsetting.cfgurl + ":10001"; //错误报告地址
        if (!window['__errorUserInfo']) {
            window['__errorUserInfo'] = {};
        }
        window['__errorUserInfo']['tag'] = this._localsetting.producttag;
        var wholeurl = this._localsetting.cfgurl + "/" + (URLProducttag || this._localsetting.producttag) + ".json";
        // console.log("wholeurl=", wholeurl);
        xhr.open("GET", wholeurl, true);
        xhr.send();
    };
    // 解析URL是否带调试参数
    ServerMgr.prototype.analysisURLParameter = function (URL) {
        var arr = URL.split("?");
        var obj = {
            url: null,
            args: {}
        };
        obj.url = arr[0];
        // 拆分后如果长度小于2说明URL是不带参数的
        if (arr.length < 2)
            return obj;
        var mapArr = arr[1].split("&");
        for (var i = 0; i < mapArr.length; i++) {
            var parameter = mapArr[i].split("=");
            obj.args[parameter[0]] = parameter[1];
        }
        // console.log("解析URL", obj)
        return obj;
    };
    ServerMgr.prototype.getProductTag = function () {
        return this._localsetting.producttag;
    };
    ServerMgr.prototype.isEnableHotUpdate = function () {
        return this._enableHotUpdate;
    };
    ServerMgr.prototype.getServerCfg = function () {
        return this._servercfg;
    };
    ServerMgr.prototype.getHotupdateVersionUrl = function () {
        return "" + this._servercfg.hotUrl;
    };
    //单例处理 
    ServerMgr._instance = new ServerMgr();
    return ServerMgr;
}());
exports.default = ServerMgr;

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
        //# sourceMappingURL=ServerMgr.js.map
        