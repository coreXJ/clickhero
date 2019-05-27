// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var envID = 'test-72db6b';
// var dbName = 'release';
cc.Class({
    statics: {
        getDB () {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                const db = wx.cloud.database({
                    env: envID
                });
                return db.collection('UserGameData');
            }
        },
        saveDBID (id) {
            const self = this;
            self.id = id;
        },

        getUserData (callBack) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                let userData = DataCenter.readGameData()
                if (userData) {
                    console.log("使用本地UserData数据");
                    callBack(false, [userData]);
                } else {
                    self.getDB().where({
                        _openid: DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                    }).get({
                        success: function (res) {
                            // res.data 包含该记录的数据
                            console.log("使用服务器UserData数据");
                            callBack(false, res.data);
                        },
                        fail: function (params) {
                            console.log("获取用户数据发生错误");
                            console.log(params);
                            callBack(true);
                        }
                    });
                }
            }
        },

        getChildUserData(callBack,isNew) { // 获取被自己推荐的用户
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                let childDatas = []
                let db = self.getDB()
                let time = cc.sys.localStorage.getItem("savechildtime") || 0
                if (time == 0||(isNew&&Date.now()-time > 5*60*1000)) {
                    var query = function() {
                        db.where({
                            referrer: DataCenter.getDataByKey(DataCenter.DataMap.OPENID)
                        }).skip(childDatas.length).limit(20).get({
                            success: function (res) {
                                // res.data 包含该记录的数据
                                childDatas = childDatas.concat(res.data)
                                if (res.data.length < 20) {
                                    DataCenter.saveChildUserData(childDatas)
                                    callBack(false, childDatas);
                                } else {
                                    query()
                                }
                            },
                            fail: function (params) {
                                console.log("获取子用户数据发生错误，使用本地的ChildUserData");
                                childDatas = DataCenter.readChildUserData() || childDatas
                                callBack(false, childDatas);
                            }
                        });
                    }
                    query()
                } else {
                    console.log("使用本地的ChildUserData");
                    childDatas = DataCenter.readChildUserData() || childDatas
                    callBack(false, childDatas);
                }
            }
        },

        add (data) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                var params = {
                    WeChatUserInfo: data.WeChatUserInfo,
                    gamedata: data.gamedata,
                    ChildUsers: [],
                    registerTime: data.registerTime
                }
                if (data.referrer) {
                    params.referrer = data.referrer;
                }
                self.getDB().add({
                    // data 字段表示需新增的 JSON 数据
                    data: params,
                    success: function (res) {
                        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                        // console.log(res)
                        self.saveDBID(res._id);
                    }
                });
            }
        },

        update (gamedata) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                self.getDB().doc(self.id).update({
                    // data 传入需要局部更新的数据
                    data: {
                        // 表示将 done 字段置为 true
                        gamedata: gamedata,
                        WeChatUserInfo: DataCenter.getDataByKey(DataCenter.DataMap.WXUserInfo)
                    },
                    success: function (res) {
                        // console.log(res);
                    }
                });
            }
        },

        updataChildUsers (usersArr) {
            const self = this;
            if (WeChatUtil.isWeChatPlatform) {
                self.getDB().doc(self.id).update({
                    // data 传入需要局部更新的数据
                    data: {
                        ChildUsers: usersArr
                    },
                    success: function (res) {
                        console.log(res);
                    }
                });
            }
        },

        updateMaxLv (){
            if (WeChatUtil.isWeChatPlatform) {
                let maxPassLavel = DataCenter.getDataByKey(DataCenter.KeyMap.maxPassLavel)||0;
                this.getDB().doc(this.id).update({
                    // data 传入需要局部更新的数据
                    data: {
                        maxLv: maxPassLavel
                    },
                    success: function (res) {
                        console.log("更新maxLv成功");
                        console.log(res);
                    }
                });
            }
        },

        getRankUsers(callback,offset){
            if (WeChatUtil.isWeChatPlatform) {
                this.getDB().orderBy('maxLv','desc').skip(offset).limit(20).get({
                    success: function (res) {
                        console.log("getRankUsers success");
                        console.log(res);
                        callback(res.data);
                    },
                    fail: function (params) {
                        console.log("getRankUsers fail");
                        callback([]);
                    }
                });
            }
        },
    }
});
