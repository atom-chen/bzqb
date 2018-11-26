(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/modules/game/script/sceneMgr/mapMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c72eab0vihLT6x8QZzEPlp7', 'mapMgr', __filename);
// modules/game/script/sceneMgr/mapMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var MapMgr = /** @class */ (function () {
    function MapMgr() {
    }
    MapMgr.prototype.initMap = function (fatherNode, node, tex, craterTex) {
        this.foreNode = node;
        this.offectX = fatherNode.x;
        this.offectY = fatherNode.y;
        this.foreTex = new cc.RenderTexture();
        this.foreTex.initWithSize(tex.width, tex.height);
        this.foreTex.drawTextureAt(tex, 0, 0);
        this.foreNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.foreTex);
        this.foreWidth = tex.width;
        this.foreHeight = tex.height;
        this.pixels = this.foreTex.readPixels();
        this.singlePixels = new Uint8Array(this.pixels.length / 4);
        for (var i = 0; i < this.singlePixels.length; ++i) {
            this.singlePixels[i] = this.pixels[4 * i + 3] > 0 ? 1 : 0;
        }
        var newTex = new cc.RenderTexture();
        newTex.initWithSize(craterTex.width, craterTex.height);
        newTex.drawTextureAt(craterTex, 0, 0);
        this.craterPixels = newTex.readPixels();
        this.craterWidth = craterTex.width;
        this.craterHeight = craterTex.height;
    };
    MapMgr.prototype.getLocalPoi = function (point) {
        var localPoint = this.foreNode.convertToNodeSpace(point);
        localPoint.x += this.offectX;
        localPoint.y += this.offectY;
        return localPoint;
    };
    MapMgr.prototype.getWorldPoi = function (point) {
        var worldPoi = this.foreNode.convertToWorldSpace(point);
        worldPoi.x -= this.offectX;
        worldPoi.y -= this.offectY;
        return worldPoi;
    };
    MapMgr.prototype.digHole = function (worldPoint, ellipseRange) {
        var localPoint = this.getLocalPoi(worldPoint);
        var sss = ellipseRange / 150;
        var poi = {
            x: ellipseRange / 2,
            y: Math.round(ellipseRange / 3)
        };
        var craterWidth = Math.round(ellipseRange * sss);
        var craterHeight = Math.round(poi.y * sss);
        // let localPoint = worldPoint;
        var pixelX = localPoint.x, pixelY = this.foreHeight - localPoint.y;
        var len = this.craterPixels.length / 4;
        console.time("弹坑");
        for (var i = 0; i < len; ++i) {
            var yInCrater = Math.floor(i / this.craterWidth), xInCrater = i - this.craterWidth * yInCrater;
            var xInFore = Math.round(xInCrater - this.craterWidth / 2 + pixelX);
            var yInFore = Math.round(yInCrater - this.craterHeight / 2 + pixelY);
            var craterIdx = 4 * i + 3, foreIdx = 4 * (yInFore * this.foreWidth + xInFore) + 3;
            if (Math.pow(xInCrater - this.craterWidth / 2, 2) / Math.pow(poi.x, 2) + Math.pow(yInCrater - this.craterHeight / 2, 2) / Math.pow(poi.y, 2) <= 1) {
                this.pixels[foreIdx] = 0;
                this.singlePixels[(yInFore * this.foreWidth + xInFore)] = 0;
            }
            else if (this.craterPixels[craterIdx] > 0 && this.pixels[foreIdx] > 0) {
                var c1 = this.pixels.slice(foreIdx - 3, foreIdx + 1);
                var c2 = this.craterPixels.slice(craterIdx - 3, craterIdx + 1);
                var blend = this._colorBlend(c1, c2);
                for (var j = 0; j <= 3; ++j) {
                    this.pixels[foreIdx - (3 - j)] = blend[j];
                }
            }
        }
        this.foreTex.initWithData(this.pixels, this.foreTex.getPixelFormat(), this.foreWidth, this.foreHeight);
        console.timeEnd("弹坑");
    };
    MapMgr.prototype._colorBlend = function (c1, c2) {
        var blend = new Uint8Array(4);
        var a1 = c1[3] / 255, a2 = c2[3] / 255;
        var aBlend = a1 + a2 - a1 * a2;
        for (var i = 0; i < 3; ++i) {
            var n1 = c1[i] / 255, n2 = c2[i] / 255;
            blend[i] = (n1 * a1 * (1 - a2) + n2 * a2) / aBlend * 255;
        }
        blend[3] = aBlend * 255;
        return blend;
    };
    // 检测是否碰撞到包围盒
    MapMgr.prototype.checkCollideGround = function (point) {
        // let localPoint = this.foreNode.convertToNodeSpace(point);
        var localPoint = this.getLocalPoi(point);
        var x = localPoint.x, y = this.foreHeight - localPoint.y;
        return !this._isEmpty(x, y);
    };
    // 获取下一个像素点
    MapMgr.prototype.getNextPoint = function (point, directX, step) {
        var localPoint = this.getLocalPoi(point);
        var foreX = localPoint.x, foreY = this.foreHeight - localPoint.y;
        for (; step >= 0; step--) {
            if (this._isEmpty(foreX, foreY + 1)) {
                foreY = this._findNextY(foreX, foreY, 1);
                break;
            }
            else {
                if (foreX > 0 && foreX < this.foreWidth) {
                    foreX += directX;
                }
                else {
                    foreY = this._findNextY(foreX, foreY, -1);
                    break;
                }
            }
            if (step == 0)
                foreY = this._findNextY(foreX, foreY, -1);
        }
        return this.getWorldPoi(cc.v2(foreX, this.foreHeight - foreY));
    };
    // 寻找y点
    MapMgr.prototype._findNextY = function (x, y, directY) {
        while (true) {
            var temY = y + directY;
            if (directY > 0 && !this._isEmpty(x, temY))
                break;
            if (directY < 0 && this._isEmpty(x, temY))
                break;
            y = temY;
        }
        return y;
    };
    MapMgr.prototype._isEmpty = function (x, y) {
        return !this.singlePixels[y * this.foreWidth + x];
    };
    MapMgr.getInstance = function () {
        if (MapMgr._instance == null) {
            MapMgr._instance = new MapMgr();
        }
        return MapMgr._instance;
    };
    MapMgr._instance = null;
    return MapMgr;
}());
exports.default = MapMgr;

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
        //# sourceMappingURL=mapMgr.js.map
        