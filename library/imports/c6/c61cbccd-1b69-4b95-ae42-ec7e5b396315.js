"use strict";
cc._RF.push(module, 'c61cbzNG2lLla5C7H5bOWMV', 'tableMgr');
// manager/public/tableMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Loader_1 = require("../../framework/modules/Loader");
var TableMgr = /** @class */ (function () {
    function TableMgr() {
        this._tableList = {};
    }
    TableMgr.getInstance = function () {
        if (TableMgr._instance == null) {
            TableMgr._instance = new TableMgr();
        }
        return TableMgr._instance;
    };
    TableMgr.prototype.search = function (name, condition) {
        if (!this._tableList.hasOwnProperty(name)) {
            this._tableList[name] = Loader_1.default.getInstance().getRes("config/" + name, cc.JsonAsset).json;
        }
        this._curTable = this._tableList[name];
        if (!this._curTable) {
            console.error("没有此配表!");
            return null;
        }
        if (Array.isArray(condition)) {
            var arr = [];
            for (var i = 0; i < condition.length; ++i) {
                arr.push(this._query(condition[i]));
            }
            return arr;
        }
        else {
            return this._query(condition);
        }
    };
    TableMgr.prototype._query = function (obj) {
        var _a = Object.entries(obj)[0], key = _a[0], value = _a[1];
        var data = this._curTable.find(function (v) { return v[key] == value; });
        return data ? data : null;
    };
    //单例处理
    TableMgr._instance = null;
    return TableMgr;
}());
exports.default = TableMgr;

cc._RF.pop();