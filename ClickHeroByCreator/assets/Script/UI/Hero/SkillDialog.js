// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        heroNode: cc.Node,
        heroName: cc.Label,
        heroLevel: cc.Label,
        heroDPS: cc.Label,
        list: cc.ScrollView,
        skillItemPrefab: cc.Prefab,
        descLab: cc.Label,

        goldenBar : cc.Node,
        lbGolden : cc.Label,
        lbGoldenTimes : cc.Label,
        lbRuby: cc.Label,
        btnGolden : cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const self = this;
        self.heroIcon = self.heroNode.getComponent("HeroIcon");
    },

    start () {
        const self = this;
        self.addSkillItem();
        self.setDisplay();
    },

    // update (dt) {},

    onEnable () {
        const self = this;
        Events.on(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.on(Events.ON_UPGRADE_HERO_SKILLS, self.onBuySkill, self);
        Events.on(Events.CLOSE_DIALOG, self.close, self);
    },

    onDisable () {
        const self = this;
        Events.off(Events.ON_GOLD_CHANGE, self.onGoldChange, self);
        Events.off(Events.ON_UPGRADE_HERO_SKILLS, self.onBuySkill, self);
        Events.off(Events.CLOSE_DIALOG, self.close, self);
    },
    
    onGoldChange () {
        const self = this;
        self.setDisplay();
    },

    onBuySkill() {
        const self = this;
        self.setDisplay();
    },

    setDialog(heroListCtor, heroID) {
        const self = this;
        self._heroID = heroID;
        self._heroListCtor = heroListCtor;
        self._hero = HeroDatas.getHero(self._heroID);
    },

    addSkillItem () {
        const self = this;
        var hero = self._hero;
        var skillArr = hero.skills;
        self.skillItem = [];
        if (skillArr) {
            for (let skillID = 0; skillID < skillArr.length; skillID++) {
                // const element = skillArr[skillID];
                var itemNode = cc.instantiate(self.skillItemPrefab);
                itemNode.parent = self.list.content;
                var component = itemNode.getComponent("SkillListItem");
                component.setItem(self._heroListCtor, self._heroID, skillID);
                self.skillItem.push(component);
            }
        }
    },

    setDisplay () {
        const self = this;
        var hero = this._hero;
        var skillArr = hero.skills;
        self.heroIcon.setIcon(self._heroListCtor, self._heroID);
        self.heroName.string = hero.heroName;
        self.heroLevel.string = "等级:" + hero.level;
        self.descLab.string = hero.desc;
        this.fullView();
        if (!self.skillItem)
        {
            return
        }
        for (let index = 0; index < self.skillItem.length; index++) {
            const item = self.skillItem[index];
            item.setDisplay();
        }
        self.btnGolden.interactable = DataCenter.isRubyEnough(GameData.upGoldenRuby)
    },

    fullView(){
        const self = this;
        var hero = this._hero;
        if (self._heroID == 0) {
            self.heroDPS.string = "点击伤害:" + Formulas.formatBigNumber(hero.DPS);
        } else {
            self.heroDPS.string = "DPS伤害:" + Formulas.formatBigNumber(hero.DPS);
        }
        // golden
        this.goldenBar.active = true; // 通过金身等级 为0 不显示
        this.lbGolden.string = "金身等级："+hero.golden;
        this.lbGoldenTimes.string = "伤害加成：+"+(hero.golden*50)+"%"
    },

    onClickUpGolden(){
        var result = this._hero.upgradeGolden();
        if (result) {
            this.fullView();
            AudioMgr.playBtn();
        }
    },

    onClickAd(){
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
        console.log("[SkillDialog]Video广告关闭，是否播放完成："+res.isEnded);
        if (res.isEnded) {
            DataCenter.addRuby(30)
            this.onClickUpGolden()
        }
        videoAd.offClose(this.callback)
    },

    close () {
        const self = this;
        self.node.destroy();
    },
});
