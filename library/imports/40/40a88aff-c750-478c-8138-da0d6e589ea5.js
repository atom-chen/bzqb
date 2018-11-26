"use strict";
cc._RF.push(module, '40a88r/x1BHjIE42g1uWJ6l', 'PlatSdk');
// framework/lib/PlatSdk.js

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var platUrl = null;
    var successcb = null;
    var failcb = null;
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            if (successcb) successcb(JSON.parse(xhr.responseText));
        }
    };
    xhr.timeout = 3000;
    xhr.ontimeout = function (err) {
        if (failcb) failcb(err);
    };
    xhr.onerror = function (err) {
        if (failcb) failcb(err);
    };

    var PlatSdk = function () {
        function PlatSdk() {
            _classCallCheck(this, PlatSdk);
        }

        _createClass(PlatSdk, [{
            key: "setPlatUrl",
            value: function setPlatUrl(url) {
                platUrl = url;
            }
        }, {
            key: "getPlatUrl",
            value: function getPlatUrl() {
                return platUrl;
            }
        }, {
            key: "_platReq",
            value: function _platReq(route) {
                var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                xhr.open("POST", platUrl, true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
                var newMsg = {
                    head: {
                        route: "http." + route,
                        uid: "0",
                        token: ""
                    },
                    body: msg
                };
                xhr.send(JSON.stringify(newMsg));
            }
        }, {
            key: "login",
            value: function login(obj) {
                var data = obj.data,
                    success = obj.success,
                    fail = obj.fail;

                successcb = success;
                failcb = fail;
                this._platReq("login", data);
            }
        }, {
            key: "register",
            value: function register(obj) {
                var data = obj.data,
                    success = obj.success,
                    fail = obj.fail;

                successcb = success;
                failcb = fail;
                this._platReq("register", data);
            }
        }, {
            key: "touristLogin",
            value: function touristLogin(obj) {
                var success = obj.success,
                    fail = obj.fail;

                successcb = success;
                failcb = fail;
                this._platReq("tourist");
            }
        }, {
            key: "wechatLogin",
            value: function wechatLogin() {
                // 待实现
            }
        }, {
            key: "QQLoign",
            value: function QQLoign() {
                // 待实现
            }
        }]);

        return PlatSdk;
    }();

    window.platSdk = new PlatSdk();
})();

cc._RF.pop();