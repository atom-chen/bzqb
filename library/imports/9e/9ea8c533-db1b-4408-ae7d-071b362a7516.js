"use strict";
cc._RF.push(module, '9ea8cUz2xtECK59Bxs2KnUW', 'hkCollider');
// modules/game/script/physics/hkcollider/hkCollider.js

'use strict';

/**
 * !#en Collider component base class.
 * !#zh 碰撞组件基类
 * @class Collider
 * @extends Component
 */
var hkCollider = cc.Class({
    extends: cc.Component,

    properties: {
        editing: {
            default: false,
            serializable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.collider.editing'
        },

        /**
         * !#en Tag. If a node has several collider components, you can judge which type of collider is collided according to the tag.
         * !#zh 标签。当一个节点上有多个碰撞组件时，在发生碰撞后，可以使用此标签来判断是节点上的哪个碰撞组件被碰撞了。
         * @property tag
         * @type {Integer}
         * @default 0
         */
        tag: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.tag',
            default: 0,
            range: [0, 10e6],
            type: cc.Integer
        }
    },

    onDisable: function onDisable() {
        cc.hkCollisionManager.removeCollider(this);
        // cc.director.getCollisionManager().removeCollider(this);
    },

    onEnable: function onEnable() {
        cc.hkCollisionManager.addCollider(this);
        // cc.director.getCollisionManager().addCollider(this);
    }
});
// cc.hkCollider = 
module.exports = hkCollider;

cc._RF.pop();