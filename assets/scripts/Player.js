// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        // 角色跳跃高度
        jumpHeight: 0,
        // 角色跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0
    },

    runJumpAction() {
        const jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: "sineOut" });
        const jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: "sineIn" });
        const tween = cc.tween().sequence(jumpUp, jumpDown);
        return cc.tween().repeatForever(tween);
    },

    onClickLeftButton() {
        this.moveCount -= 1;
        // this.node.x -= 50;
    },

    onClickRightButton() {
        this.moveCount += 1;
        // this.node.x += 50;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start();
        this.moveCount = 0;
    },

    start () {

    },

    update(dt) {
        // // console.log("🚀 ~ file: Player.js ~ line 64 ~ update ~ dt", dt);
        this.node.x = 50 * this.moveCount;
        // console.log("🚀 ~ file: Player.js ~ line 69 ~ update ~ this.moveCount", this.moveCount)
    }
});
