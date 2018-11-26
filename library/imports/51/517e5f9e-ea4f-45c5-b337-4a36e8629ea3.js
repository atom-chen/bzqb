"use strict";
cc._RF.push(module, '517e5+e6k9FxbM3SjboYp6j', 'fightTool');
// modules/game/script/common/fightTool.ts

Object.defineProperty(exports, "__esModule", { value: true });
var fightRandomSeed_1 = require("../common/fightRandomSeed");
// 随机数
var randomSeed = fightRandomSeed_1.default.getInstance();
var tool = /** @class */ (function () {
    function tool() {
    }
    // 乱序
    tool.shuffle = function (arr) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var index = Math.floor(randomSeed.random() * (len - i));
            var temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    };
    tool.randomValue = function (max, min) {
        var time = ((randomSeed.random() * (max - min) + min) * 1000);
        return time;
    };
    // 数组随机获取
    tool.randomPick = function (arr, len) {
        if (arr.length <= len) {
            console.error("使用错误");
            return;
        }
        var newArr = tool.shuffle(arr.slice(0));
        return newArr.splice(0, len);
    };
    // 找出两个数组的差值数组
    tool.differenceArray = function (arrOrg, arr) {
        var newArr = [];
        for (var i = 0; i < arrOrg.length; i++) {
            var isInArr = false;
            for (var s = 0; s < arr.length; s++) {
                if (arr[s] == arrOrg[i]) {
                    isInArr = true;
                }
            }
            if (!isInArr) {
                newArr.push(arrOrg[i]);
            }
        }
        return newArr;
    };
    // 选择排序
    tool.selectSort = function (arr, useFun) {
        var len = arr.length;
        var temp;
        for (var i = 0; i < len - 1; i++) {
            for (var j = i + 1; j < len; j++) {
                var uu = useFun(arr[i]);
                var yy = useFun(arr[j]);
                if (uu < yy) {
                    temp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = temp;
                }
            }
        }
        return arr;
    };
    // 返回一个类椭圆圈
    tool.createPoint = function (width, realPoi) {
        var poi = {
            x: Math.round(realPoi.x),
            y: Math.round(realPoi.y)
        };
        // console.log("createPoint++++++",poi);
        // 计算points点为信息
        var height = Math.round(width / 3);
        var poi1 = {
            x: -height + poi.x,
            y: -width + poi.y
        };
        var poi2 = {
            x: height + poi.x,
            y: -width + poi.y
        };
        var poi3 = {
            x: width + poi.x,
            y: 0 + poi.y
        };
        var poi4 = {
            x: height + poi.x,
            y: height + poi.y
        };
        var poi5 = {
            x: -height + poi.x,
            y: height + poi.y
        };
        var poi6 = {
            x: -width + poi.x,
            y: 0 + poi.y
        };
        var points = [];
        points.push(poi1);
        points.push(poi2);
        points.push(poi3);
        points.push(poi4);
        points.push(poi5);
        points.push(poi6);
        return points;
    };
    // 点的碰撞检测
    tool.pointInPolygon = function (point, polygon) {
        var inside = false;
        var x = point.x;
        var y = point.y;
        var length = polygon.length;
        for (var i = 0, j = length - 1; i < length; j = i++) {
            var xi = polygon[i].x, yi = polygon[i].y, xj = polygon[j].x, yj = polygon[j].y, intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
        }
        return inside;
    };
    // 获取向量的夹角
    tool.getAngleByVector = function (vecX, vecY) {
        if (vecY === 0) {
            if (vecX < 0) {
                return 180;
                // return 270;
            }
            else if (vecX > 0) {
                return 0;
                // return 90;
            }
            return 0;
        }
        if (vecX === 0) {
            if (vecY >= 0) {
                return 270;
                // return 0;
            }
            else if (vecY < 0) {
                return 90;
                // return 180;
            }
        }
        var tan_yx = Math.abs(vecY) / Math.abs(vecX);
        var angle = 0;
        // 第二象限
        if (vecY > 0 && vecX < 0) {
            angle = Math.round(180 - (1000 * Math.atan(tan_yx) * 180 / (tool.PI * 1000)));
            // 第一象限
        }
        else if (vecY > 0 && vecX > 0) {
            angle = Math.round(1000 * Math.atan(tan_yx) * 180 / (1000 * tool.PI));
            // 第三象限
        }
        else if (vecY < 0 && vecX < 0) {
            angle = Math.round(180 + 1000 * Math.atan(tan_yx) * 180 / (1000 * tool.PI));
            // 第四象限
        }
        else if (vecY < 0 && vecX > 0) {
            angle = Math.round(360 - 1000 * Math.atan(tan_yx) * 180 / (1000 * tool.PI));
        }
        return angle;
    };
    tool.PI = 3.14;
    return tool;
}());
exports.default = tool;

cc._RF.pop();