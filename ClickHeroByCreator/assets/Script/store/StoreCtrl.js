

cc.Class({
    extends: cc.Component,

    properties: {
        sv : cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialogPrefab : cc.Prefab,
        lbRuby : cc.Label,
        btnAd : cc.Node,
    },

    onLoad(){
        console.log("StoreCtrl:ctor");
        this.items = new Array();
        Events.on(Events.ON_RUBY_CHANGE,this.showRuby,this);
        this.fullViews();
        this.showRuby();
        this.onMaxPassLavelChange()
        Events.on(Events.ON_MAXLEVEL_UPDATE, this.onMaxPassLavelChange, this)

        if (!window.videoAd) {
            this.btnAd.active = false
        }
    },

    onAdClick(){
        if (window.videoAd) {
            this.callback = this.onCloseAd.bind(this)
            videoAd.onClose(this.callback)
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                })
            })
        }
    },

    onCloseAd(res){
        console.log("Video广告关闭，是否播放完成："+res.isEnded);
        if (res.isEnded) {
            PublicFunc.popGoldDialog(2,20,null,true)
        }
        videoAd.offClose(this.callback)
    },


    onDestroy (){
        Events.off(Events.ON_MAXLEVEL_UPDATE, this.onMaxPassLavelChange, this)
    },

    showRuby(){
        var ruby = DataCenter.getDataByKey(DataCenter.KeyMap.ruby)
        this.lbRuby.string = ""+ruby
    },

    fullViews(){
        try {
            let list = GoodsDatas.datas;
            // console.log(list);

            list.forEach(e => {
                this.addItem(e);
            });
        } catch (error) {
            console.error(error);
            
        }

    },

    onMaxPassLavelChange(){
        let lv = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel) || 0
        lv = lv + 50
        this.items.forEach(node => {
            let data = node.getComponent("GoodsItem").data
            let active = Boolean(data.unlockLv <= lv)
            if (node.active != active){
                node.active = active
            }
        });
    },

    addItem(goods) {
        var node = cc.instantiate(this.itemPrefab);
        node.parent = this.sv.content;
        node.getComponent("GoodsItem").bind(goods);
        this.items.push(node)
    },
});