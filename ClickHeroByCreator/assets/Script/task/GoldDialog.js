
cc.Class({
    extends: cc.Component,

    properties: {
        sp : cc.Sprite,
        lbTitle : cc.Label,
        lbCount : cc.Label,
        icons : [cc.SpriteFrame],
        btnAd : cc.Node,
        btn : cc.Node,
        lbTips : cc.Label,
        lbAd : cc.Label,
    },

    start () {
        
    },

    // type: 0 gold, 1 soul, 2 ruby.
    setDatas(type,num,title,disDouble){
        if (title) {
            this.lbTitle.string = title
        }
        this.type = type
        this.num = num
        this.disDouble = disDouble
        this.sp.spriteFrame = this.icons[type]
        this.lbCount.string = type == 2?num : Formulas.formatBigNumber(num)
        if (disDouble||!window.videoAd) {
            this.btnAd.active = false
            this.lbTips.node.active = false
            this.btn.x = 0
            console.log("this.btn.x = 0");
        } else {
            let strAd = ""
            if (type == 0) {
                strAd = "随机翻2-10倍"
                let times = Formulas.randomNum(2,10)
                this.numAd = this.num.times(times)
                this.lbTips.string = "妖丹×" + times
            } else if (type == 1) {
                let add = this.num.times(0.2).integerValue()
                if (add.lt(2)) {
                    add = new BigNumber(2)
                }
                this.numAd = this.num.plus(add)
                strAd = "额外获得"+Formulas.formatBigNumber(add) + "仙丹"
                this.lbTips.string = "已增加"+Formulas.formatBigNumber(add) + "仙丹"
            } else if (type == 2) {
                strAd = "翻倍获取仙桃"
                this.numAd = this.num * 2
                this.lbTips.string = "仙桃×" + 2
            }
            this.lbAd.string = strAd
        }
    },

    onClick(){
        if (this.type == 0) {
            DataCenter.addGold(this.num)
        }else if(this.type == 1){
            DataCenter.addSoul(this.num)
        }else if(this.type == 2){
            DataCenter.addRuby(this.num)
        }
        this.node.destroy()
    },

    onAdClick(){
        if (!WeChatUtil.adEnable) {
            WeChatUtil.popVersionLow()
            return
        }
        if (window.videoAd) {
            this.callback = this.onCloseAd.bind(this)
            videoAd.onClose(this.callback)
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                    wx.showModal({
                        title: '提示',
                        content: '广告显示失败，请稍后重试。'
                    })
                })
            })
        }
    },

    onCloseAd(res){
        console.log("[GoldDialog]Video广告关闭，是否播放完成："+res.isEnded);
        if (res.isEnded) {
            this.btnAd.active = false
            this.num = this.numAd ? this.numAd : this.num
            this.lbCount.string = this.type == 2?this.num : Formulas.formatBigNumber(this.num)
        }
        videoAd.offClose(this.callback)
    },

    // update (dt) {},
});
