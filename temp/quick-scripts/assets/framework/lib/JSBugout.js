(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/lib/JSBugout.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c7627F1sZBGMrnYw3ruXymy', 'JSBugout', __filename);
// framework/lib/JSBugout.js

'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sendDic = {};
(function () {
	window['__errorUserInfo'] = {}; //错误日志的用户信息
	window['__errorOp'] = []; //错误日志的操作信息
	var jsbugout = {};
	window.jsbugout = jsbugout;
	jsbugout.jsbugoutListenning = function () {
		if (cc.sys.isNative) {
			var __handler = void 0;
			if (window['__errorHandler']) {
				__handler = window['__errorHandler'];
			}
			window['__errorHandler'] = function (file, line, msg, error) {
				console.log('游戏报错,原生系统');
				jsbugout.handleError(file, line, msg, error);
				if (__handler) {
					__handler(file, line, msg, error);
				}
			};
		}
	};
	jsbugout.handleError = function (file, line, msg, error) {
		var _stack;

		//需要具体错误端
		if (null == msg || undefined == msg) {
			return;
		}
		//发送过的类型就不再重复发送
		if (sendDic[msg]) {
			return;
		}
		sendDic[msg] = true;
		//上报给服务器 
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.onreadystatechange = function () {};
		//报告地址
		var url = window['__errorReportUrl'] || "http://120.78.95.186:10001";
		//url="http://192.168.30.28:10001"
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
		var ops = window['__errorOp'];
		var opstr = "";
		for (var i = 0; i < ops.length; ++i) {
			opstr += ops[i];
			if (i < ops.length - 1) {
				opstr += '>>';
			}
		}
		error = error.replace(/\t/g, '&&');
		error = error.replace(/\n/g, '&&');
		var data = {
			ops: opstr,
			userinfo: window['__errorUserInfo'],
			stack: (_stack = {
				file: file,
				msg: msg }, _defineProperty(_stack, 'msg', msg), _defineProperty(_stack, 'line', line), _defineProperty(_stack, 'error', error), _stack)
		};
		xhr.send(JSON.stringify(data));
	};
	jsbugout.jsbugoutListenning();
	module.exports = jsbugout;
})();

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
        //# sourceMappingURL=JSBugout.js.map
        