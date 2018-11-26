import ModuleMgr from "../modules/ModuleMgr";
import Loader from "../modules/Loader";

/** @description 视图基类 */
export default class BaseView {
    public ui: any;
    protected model: any;
    protected node: cc.Node;
    private _grayLayer: cc.Node;

    constructor(model: any) {
        this.model = model;
    }

    public initUi(): void {

    }
    /**
     * 加载图片
     * @param imageName 图片名
     * @param isPublic 是否是公共的，默认不是
     */
    public loadImage(imageName: string, isPublic: boolean = false): Promise<cc.SpriteFrame> {
        return ModuleMgr.getInstance().loadImage(imageName, isPublic);
    }

    public getImageSync(imageName: string, isPublic: boolean = false): cc.SpriteFrame {
        let url = ModuleMgr.getInstance().getResUrl("image", imageName, isPublic);
        return Loader.getInstance().getRes(url, cc.SpriteFrame);
    }

    /**
     * 创建子节点
     * @param prefab 需要实例化的预制或需要复制的节点
     * @param parentNode 父节点
     * @param zIndex z轴，默认为0
     */
    protected addPrefabNode(prefab: cc.Prefab | cc.Node, parentNode: cc.Node, zIndex: number = 0): cc.Node {
        let prefabNode: cc.Node = <cc.Node>cc.instantiate(prefab);
        prefabNode.parent = parentNode;
        prefabNode.zIndex = zIndex;
        return prefabNode;
    }
    /**
     * 添加点击吞噬遮罩
     * @param black 是否是黑色，默认是
     */
    protected addGrayLayer(black: boolean = true): void {
        if (cc.isValid(this.node, true)) {
            this._grayLayer = new cc.Node();
            if (black) {
                this._grayLayer.color = cc.Color.BLACK;
                this._grayLayer.opacity = 150;
                let sprite = this._grayLayer.addComponent(cc.Sprite);
                sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.loadImage("singleColor", true).then((spF: cc.SpriteFrame) => {
                    sprite.spriteFrame = spF;
                });
            }
            this._grayLayer.parent = this.node;
            let size = cc.view.getVisibleSize();
            this._grayLayer.width = size.width;
            this._grayLayer.height = size.height;
            this._grayLayer.zIndex = -1;
            this._grayLayer.addComponent(cc.BlockInputEvents);
        }
    }
    /**
     * 字符串截取
     * @param content 内容
     * @param len 需要的长度
     */
    public cutString(content: string, len: number): string {
        if (content.length > len) {
            return `${content.slice(0, len)}...`;
        }
        return content;
    }
    /**
     * 字符串转换
     * @param content 内容
     * @param keyword 关键字
     * @param ReplaceWords 替换字数组
     */
    stringReplace(content: string, keyword: string, ReplaceWords: string[]) {
        for (let i = 0; i < ReplaceWords.length; i++) {
            content = content.replace(keyword, ReplaceWords[i])
        }
        return content;
    }

    /**
     * 数字省略
     * @param nub 数字
     */
    public numberEllipsis(num: number): string {
        let output = null;
        if (num >= 100000) {
            output = Math.floor(num / 1000).toString() + "k";
        }
        else {
            output = num.toString();
        }
        return output;
    }


}