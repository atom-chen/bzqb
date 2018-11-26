
const Contact = require('hkContact');
const CollisionType = Contact.CollisionType;
const math = cc.vmath;

let _vec2 = cc.v2();
function obbApplyMatrix (rect, mat4, out_bl, out_tl, out_tr, out_br) {
    var x = rect.x;
    var y = rect.y;
    var width = rect.width;
    var height = rect.height;

    var m00 = mat4.m00, m01 = mat4.m01, m04 = mat4.m04, m05 = mat4.m05;
    var m12 = mat4.m12, m13 = mat4.m13;

    var tx = m00 * x + m04 * y + m12;
    var ty = m01 * x + m05 * y + m13;
    var xa = m00 * width;
    var xb = m01 * width;
    var yc = m04 * height;
    var yd = m05 * height;

    out_tl.x = tx;
    out_tl.y = ty;
    out_tr.x = xa + tx;
    out_tr.y = xb + ty;
    out_bl.x = yc + tx;
    out_bl.y = yd + ty;
    out_br.x = xa + yc + tx;
    out_br.y = xb + yd + ty;
};

let hkCollisionManager = cc.Class({
    mixins: [cc.EventTarget],

    properties: {
        enabled: false,
        enabledDrawBoundingBox: false
    },

    ctor: function () {
        this._contacts = [];
        this._colliders = [];
        this._debugDrawer = null;
        this._enabledDebugDraw = false;
    },

    netFrame: function (dt) {
        if (!this.enabled) {
            return;
        }


        let i, l;

        // update collider
        let colliders = this._colliders;
        for (i = 0, l = colliders.length; i < l; i++) {
            this.updateCollider(colliders[i]);
        }

        // do collide
        let contacts = this._contacts;
        let results = [];
        
        for (i = 0, l = contacts.length; i < l; i++) {
            let collisionType = contacts[i].updateState();
            if (collisionType === CollisionType.None) {
                continue;
            }

            results.push([collisionType, contacts[i]]);
        }
        // handle collide results, emit message
        for (i = 0, l = results.length; i < l; i++) {
            let result = results[i];
            this._doCollide(result[0], result[1]);
        }
        // draw colliders
        this.drawColliders();
    },

    _doCollide: function (collisionType, contact) {
        let contactFunc;
        switch (collisionType) {
            case CollisionType.CollisionEnter:
                contactFunc = 'wmCollisionEnter';
                break;
            case CollisionType.CollisionStay:
                contactFunc = 'wmCollisionStay';
                break;
            case CollisionType.CollisionExit:
                contactFunc = 'wmCollisionExit';
                break;
        }

        let collider1 = contact.collider1;
        let collider2 = contact.collider2;

        let comps1 = collider1.node._components;
        let comps2 = collider2.node._components;

        let i, l, comp;
        for (i = 0, l = comps1.length; i < l; i++) {
            comp = comps1[i];
            if (comp[contactFunc]) {
                comp[contactFunc](collider2, collider1);
            }
        }

        for (i = 0, l = comps2.length; i < l; i++) {
            comp = comps2[i];
            if (comp[contactFunc]) {
                comp[contactFunc](collider1, collider2);
            }
        }
    }, 

    shouldCollide: function (c1, c2) {
        let node1 = c1.node, node2 = c2.node;
        let collisionMatrix = cc.game.collisionMatrix;
        // console.log("collisionMatrix",collisionMatrix);
        return node1 !== node2 && collisionMatrix[node1.groupIndex][node2.groupIndex];
    },

    initCollider: function (collider) {
        if (!collider.world) {
            let world = collider.world = {};
            world.aabb = cc.rect();
            world.preAabb = cc.rect();
            world.matrix = math.mat4.create();

            world.radius = 0;

            if (collider instanceof cc.BoxCollider) {
                world.position = null;
                world.points = [cc.v2(), cc.v2(), cc.v2(), cc.v2()];
            }
            else if (collider instanceof cc.PolygonCollider) {
                world.position = null;
                world.points = collider.points.map(function (p) {
                    return cc.v2(p.x, p.y);
                });
            }
            else if (collider instanceof cc.CircleCollider) {
                world.position = cc.v2();
                world.points = null;
            }
        }
    },

    updateCollider: function (collider) {
        let offset = collider.offset;
        let world = collider.world;
        let aabb = world.aabb;

        let m = world.matrix;
        collider.node.getWorldMatrix(m);

        let preAabb = world.preAabb;
        preAabb.x = aabb.x;
        preAabb.y = aabb.y;
        preAabb.width = aabb.width;
        preAabb.height = aabb.height;

        if (collider instanceof cc.BoxCollider) {
            let size = collider.size;

            aabb.x = offset.x - size.width/2;
            aabb.y = offset.y - size.height/2;
            aabb.width = size.width;
            aabb.height = size.height;

            let wps = world.points;
            let wp0 = wps[0], wp1 = wps[1],
                wp2 = wps[2], wp3 = wps[3];
            obbApplyMatrix(aabb, m, wp0, wp1, wp2, wp3);

            let minx = Math.min(wp0.x, wp1.x, wp2.x, wp3.x);
            let miny = Math.min(wp0.y, wp1.y, wp2.y, wp3.y);
            let maxx = Math.max(wp0.x, wp1.x, wp2.x, wp3.x);
            let maxy = Math.max(wp0.y, wp1.y, wp2.y, wp3.y);

            aabb.x = minx;
            aabb.y = miny;
            aabb.width = maxx - minx;
            aabb.height = maxy - miny;
        }
        else if (collider instanceof cc.CircleCollider) {
            // calculate world position
            math.vec2.transformMat4(_vec2, collider.offset, m);

            world.position.x = _vec2.x;
            world.position.y = _vec2.y;

            // calculate world radius
            let tempx = m.m12, tempy = m.m13;
            m.m12 = m.m13 = 0;

            _vec2.x = collider.radius;
            _vec2.y = 0;

            math.vec2.transformMat4(_vec2, _vec2, m);
            let d = Math.sqrt(_vec2.x * _vec2.x + _vec2.y * _vec2.y);

            world.radius = d;

            aabb.x = world.position.x - d;
            aabb.y = world.position.y - d;
            aabb.width = d * 2;
            aabb.height = d * 2;

            m.m12 = tempx;
            m.m13 = tempy;
        }
        else if (collider instanceof cc.PolygonCollider) {
            let points = collider.points;
            let worldPoints = world.points;

            worldPoints.length = points.length;

            let minx = 1e6, miny = 1e6, maxx = -1e6, maxy = -1e6;
            for (let i = 0, l = points.length; i < l; i++) {
                if (!worldPoints[i]) {
                    worldPoints[i] = cc.v2();
                }

                _vec2.x = points[i].x + offset.x;
                _vec2.y = points[i].y + offset.y;
                
                math.vec2.transformMat4(_vec2, _vec2, m);
                
                let x = _vec2.x;
                let y = _vec2.y;

                worldPoints[i].x = x;
                worldPoints[i].y = y;

                if (x > maxx) maxx = x;
                if (x < minx) minx = x;
                if (y > maxy) maxy = y;
                if (y < miny) miny = y;
            }

            aabb.x = minx;
            aabb.y = miny;
            aabb.width = maxx - minx;
            aabb.height = maxy - miny;
        }
    },

    addCollider: function (collider) {
        let colliders = this._colliders;
        let index = colliders.indexOf(collider);
        if (index === -1) {
            for (let i = 0, l = colliders.length; i < l; i++) {
                let other = colliders[i];
                if (this.shouldCollide(collider, other)) {
                    let contact = new Contact(collider, other);
                    this._contacts.push(contact);
                }
            }

            colliders.push(collider);
            this.initCollider(collider);
        }

        collider.node.on(cc.Node.EventType.GROUP_CHANGED, this.onNodeGroupChanged, this);
    },

    removeCollider: function (collider) {
        let colliders = this._colliders;
        let index = colliders.indexOf(collider);
        if (index >= 0) {
            colliders.splice(index, 1);

            let contacts = this._contacts;
            for (let i = contacts.length - 1; i >= 0; i--) {
                let contact = contacts[i];
                if (contact.collider1 === collider || contact.collider2 === collider) {
                    if (contact.touching) {
                        // this._doCollide(CollisionType.CollisionExit, contact);
                    }

                    contacts.splice(i, 1);
                }
            }

            collider.node.off(cc.Node.EventType.GROUP_CHANGED, this.onNodeGroupChanged, this);
        }
        // else {
        //     cc.errorID(6600);
        // }
    },

    onNodeGroupChanged: function (node) {
        let colliders = node.getComponents(cc.Collider);

        for (let i = 0, l = colliders.length; i < l; i++) {
            this.removeCollider(colliders[i]);
            this.addCollider(colliders[i]);
        }
    },

    drawColliders: function () {
        if (!this._enabledDebugDraw) {
            return;
        }

        this._checkDebugDrawValid();

        let debugDrawer = this._debugDrawer;
        debugDrawer.clear();

        let colliders = this._colliders;

        for (let i = 0, l = colliders.length; i < l; i++) {
            let collider = colliders[i];

            debugDrawer.strokeColor = cc.Color.WHITE;
            if (collider instanceof cc.BoxCollider || collider instanceof cc.PolygonCollider) {
                let ps = collider.world.points;
                if (ps.length > 0) {
                    debugDrawer.moveTo(ps[0].x, ps[0].y);
                    for (let j = 1; j < ps.length; j++) {
                        debugDrawer.lineTo(ps[j].x, ps[j].y);
                    }
                    debugDrawer.close();
                    debugDrawer.stroke();
                }
            }
            else if (collider instanceof cc.CircleCollider) {
                debugDrawer.circle(collider.world.position.x, collider.world.position.y, collider.world.radius);
                debugDrawer.stroke();
            }

            if (this.enabledDrawBoundingBox) {
                let aabb = collider.world.aabb;
                
                debugDrawer.strokeColor = cc.Color.BLUE;
                
                debugDrawer.moveTo(aabb.xMin, aabb.yMin);
                debugDrawer.lineTo(aabb.xMin, aabb.yMax);
                debugDrawer.lineTo(aabb.xMax, aabb.yMax);
                debugDrawer.lineTo(aabb.xMax, aabb.yMin);

                debugDrawer.close();
                debugDrawer.stroke();
            }
        }
    },

    _checkDebugDrawValid () {
        if (!this._debugDrawer || !this._debugDrawer.isValid) {
            let node = new cc.Node('COLLISION_MANAGER_DEBUG_DRAW');
            node.zIndex = cc.macro.MAX_ZINDEX;
            cc.game.addPersistRootNode(node);
            this._debugDrawer = node.addComponent(cc.Graphics);
        }
    }
});


module.exports = new hkCollisionManager();
