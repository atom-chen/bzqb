export default class MapMgr {
    foreTex: cc.RenderTexture;
    foreNode: cc.Node;
    foreWidth: number;
    foreHeight: number;
    pixels: Uint8Array;
    singlePixels: Uint8Array;
    craterPixels: Uint8Array;
    craterWidth: number;
    craterHeight: number;
    // 偏移量
    offectX:number;
    offectY:number;

    public initMap(fatherNode:cc.Node,node: cc.Node, tex: cc.Texture2D, craterTex: cc.Texture2D,): void {
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
        for (let i = 0; i < this.singlePixels.length; ++i) {
            this.singlePixels[i] = this.pixels[4 * i + 3] > 0 ? 1 : 0;
        }

        let newTex = new cc.RenderTexture();
        newTex.initWithSize(craterTex.width, craterTex.height);
        newTex.drawTextureAt(craterTex, 0, 0);
        this.craterPixels = newTex.readPixels();
        this.craterWidth = craterTex.width;
        this.craterHeight = craterTex.height;
    }

    getLocalPoi(point:cc.Vec2){
        let localPoint = this.foreNode.convertToNodeSpace(point);
        localPoint.x += this.offectX;
        localPoint.y += this.offectY;
        return localPoint;
    }

    getWorldPoi(point:cc.Vec2){
        let worldPoi = this.foreNode.convertToWorldSpace(point);
        worldPoi.x -= this.offectX;
        worldPoi.y -= this.offectY;
        return worldPoi;
    }

    public digHole(worldPoint: cc.Vec2,ellipseRange:number): void {
        let localPoint = this.getLocalPoi(worldPoint);
        let sss = ellipseRange/150;
        let poi = {
            x:ellipseRange/2,
            y:Math.round(ellipseRange/3)
        };
        let craterWidth = Math.round(ellipseRange*sss);
        let craterHeight = Math.round(poi.y*sss);
        // let localPoint = worldPoint;
        let pixelX = localPoint.x, pixelY = this.foreHeight - localPoint.y;
        let len = this.craterPixels.length / 4;
        console.time("弹坑");
        for (let i = 0; i < len; ++i) {
            let yInCrater = Math.floor(i / this.craterWidth), xInCrater = i - this.craterWidth * yInCrater;
            let xInFore = Math.round(xInCrater - this.craterWidth / 2 + pixelX);
            let yInFore = Math.round(yInCrater - this.craterHeight / 2 + pixelY);
            let craterIdx = 4 * i + 3, foreIdx = 4 * (yInFore * this.foreWidth + xInFore) + 3;
            if (Math.pow(xInCrater - this.craterWidth / 2, 2) / Math.pow(poi.x, 2) + Math.pow(yInCrater - this.craterHeight / 2, 2) / Math.pow(poi.y, 2) <= 1) {
                this.pixels[foreIdx] = 0;
                this.singlePixels[(yInFore * this.foreWidth + xInFore)] = 0;
            } else if (this.craterPixels[craterIdx] > 0 && this.pixels[foreIdx] > 0) {
                let c1 = this.pixels.slice(foreIdx - 3, foreIdx + 1);
                let c2 = this.craterPixels.slice(craterIdx - 3, craterIdx + 1);
                let blend = this._colorBlend(c1, c2);
                for (let j = 0; j <= 3; ++j) {
                    this.pixels[foreIdx - (3 - j)] = blend[j];
                }
            }
        }
        this.foreTex.initWithData(this.pixels, this.foreTex.getPixelFormat(), this.foreWidth, this.foreHeight);
        console.timeEnd("弹坑");
    }

    private _colorBlend(c1: Uint8Array, c2: Uint8Array): Uint8Array {
        let blend = new Uint8Array(4);
        let a1 = c1[3] / 255, a2 = c2[3] / 255;
        let aBlend = a1 + a2 - a1 * a2;
        for (let i = 0; i < 3; ++i) {
            let n1 = c1[i] / 255, n2 = c2[i] / 255;
            blend[i] = (n1 * a1 * (1 - a2) + n2 * a2) / aBlend * 255;
        }
        blend[3] = aBlend * 255;
        return blend;
    }

    // 检测是否碰撞到包围盒
    public checkCollideGround(point: cc.Vec2): boolean {
        // let localPoint = this.foreNode.convertToNodeSpace(point);
        let localPoint = this.getLocalPoi(point);
        let x = localPoint.x, y = this.foreHeight - localPoint.y;
        return !this._isEmpty(x, y);
    }

    // 获取下一个像素点
    public getNextPoint(point: cc.Vec2, directX: number, step: number): cc.Vec2 {
        let localPoint = this.getLocalPoi(point);
        let foreX = localPoint.x, foreY = this.foreHeight - localPoint.y;
        for (; step >= 0; step--) {
            if (this._isEmpty(foreX, foreY + 1)) {
                foreY = this._findNextY(foreX, foreY, 1);
                break;
            } else {
                if (foreX > 0 && foreX < this.foreWidth) {
                    foreX += directX;
                } else {
                    foreY = this._findNextY(foreX, foreY, -1);
                    break;
                }
            }
            if (step == 0) foreY = this._findNextY(foreX, foreY, -1);
        }
        return this.getWorldPoi(cc.v2(foreX, this.foreHeight - foreY));
    }

    // 寻找y点
    private _findNextY(x: number, y: number, directY: number): number {
        while (true) {
            let temY = y + directY;
            if (directY > 0 && !this._isEmpty(x, temY)) break;
            if (directY < 0 && this._isEmpty(x, temY)) break;
            y = temY;
        }
        return y;
    }

    private _isEmpty(x: number, y: number): boolean {
        return !this.singlePixels[y * this.foreWidth + x];
    }

    private static _instance: MapMgr = null;
    public static getInstance(): MapMgr {
        if (MapMgr._instance == null) {
            MapMgr._instance = new MapMgr();
        }
        return MapMgr._instance;
    }
}