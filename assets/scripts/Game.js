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
        // 星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab,
        },

        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,

        ground: {
            default: null,
            type: cc.Node,
        },

        player: {
            default: null,
            type: cc.Node,
        },

        scoreDisplay: {
            default: null,
            type: cc.Label,
        },

        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // if (!this.ground) return false;

        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;

        // 初始化计分
        this.score = 0;
        // 生成一个新的星星
        this.spawnNewStar();
    },
    
    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = "Score: " + this.score.toString();

        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    spawnNewStar() {
        const newStar = cc.instantiate(this.starPrefab);

        this.node.addChild(newStar);

        newStar.setPosition(this.getNewStarPosition());

        newStar.getComponent("Star").game = this;

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition() {
        let randX = 0;
        const randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50;
        const maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    },

    start() {},

    update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }

        this.timer += dt;
    },

    onClickBackButton() {
        cc.director.loadScene("menu");
    },

    gameOver: function () {
        // 停止 Player 节点的跳跃动作
        this.player.stopAllActions();

        // 重新加载场景 game
        cc.director.loadScene("game");
    },
});
