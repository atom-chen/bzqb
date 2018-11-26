
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Mask)
    maskNode: cc.Mask = null;
    @property(cc.SpriteFrame)
    frame: cc.SpriteFrame = null;



    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.addPoint, this);
        // this._addCircle({
        // 	x:0,
        // 	y:0
        // });
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.addPoint, this);
    }

    addPoint(event){
        var point = event.touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        this._addCircle(point);
    }
    _addCircle(point) {
    	console.log("point",point)
    	let node = new cc.Node();
    	node.addComponent(cc.Sprite).spriteFrame = this.frame;
    	node.x = point.x;
    	node.y = point.y;
    	node.width = 350;
    	node.height = 250;
    	node.parent = this.maskNode.node;

        var stencil = this.maskNode._graphics;
    	console.log(stencil)
        stencil.lineWidth = 10;
        stencil.fillColor.fromHEX('#ff0000');
        stencil.ellipse(point.x,point.y, 150,100);
        stencil.stroke();
        stencil.fill();

        if (!CC_JSB) {
            cc.renderer.childrenOrderDirty = true;
        }
    }
 

    // update (dt) {}
}
