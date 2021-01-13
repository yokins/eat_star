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
        accel: 0,

        jumpAudio: {
            default: null,
            type: cc.AudioClip,
        },
        scoreAudio: {
            default: null,
            type: cc.AudioClip,
        },
    },

    runJumpAction() {
        const jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: "sineOut" });
        const jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: "sineIn" });
        const tween = cc.tween().sequence(jumpUp, jumpDown).call(this.playJumpSound, this);
        return cc.tween().repeatForever(tween);
    },

    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    onClickLeftButton() {
        this.accLeft = true;
        this.accRight = false;
    },

    onClickRightButton() {
        this.accLeft = false;
        this.accRight = true;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start();
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
    },

    start() {},

    update(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
        }

        const rect = cc.view.getViewportRect();

        const x = this.node.x + this.xSpeed * dt;

        if (x > -rect.width && x < rect.width) {
            this.node.x += this.xSpeed * dt;
        } else {
            this.xSpeed = 0;
            this.accLeft = false;
            this.accRight = false;
        }
    },
});
