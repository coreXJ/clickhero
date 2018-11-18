// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var CfgMgr = require("LocalCfgMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        uiRoot: cc.Node,
    },

    ctor () {
        
    },

    onLoad () {
        const self = this;
        self.bg.zIndex = 1000;
        self.uiRoot.active = false;
        self.gameController = self.uiRoot.getComponent("GameController")
        self.initGame();
    },
    
    start () {
        const self = this;
        
    },

    initGame () {
        const self = this;
        window.WeChatUtil = new (require("WeChatUtils"))();
        window.DataCenter = new (require("DataCenter"))();
        window.Formulas = require("Formulas");
        // window.GameData = new (require("GameData"))();
        // window.HeroDatas = new (require("HeroDatas"))();
        window.GameData = require("GameData");
        window.HeroDatas = require("HeroDatas");
        window.Events = require("Events");
        window.BigNumber = require("BigNumber");
        window.ZoneArr = require("ZoneCfg");
        window.CloudDB = require("CloudDB");

        CfgMgr.loadHeroCfg(self.checkReady.bind(self));
        CfgMgr.loadSkillCfg(self.checkReady.bind(self));
        CfgMgr.loadAncientCfg();
    },

    checkReady() {
        const self = this;
        // 检查全局工具类是否加载完成
        if (window.WeChatUtil == undefined) return;
        if (window.DataCenter == undefined) return;
        if (window.Formulas == undefined) return;
        if (window.GameData == undefined) return;
        if (window.HeroDatas == undefined) return;
        if (window.Events == undefined) return;
        if (window.BigNumber == undefined) return;
        if (window.ZoneArr == undefined) return;
        
        // 检查本地配置是否加载完成
        if (window.HerosCfg == undefined) return;
        if (window.SkillCfg == undefined) return;

        console.log("所有本地配置加载完成");
        self.login();
    },

    onChildUserData(dataArr) {
        const self = this;
        console.log("onChildUserData");
        console.log(dataArr);
        if (dataArr && dataArr.length > 0) {
            var childUserArr = [];
            for (let index = 0; index < dataArr.length; index++) {
                const childUserCloudData = dataArr[index];
                childUserArr.push(childUserCloudData._openid);
            }
            var cloudInfo = DataCenter.getCloudData();
            var cloudChildUsers = cloudInfo.ChildUsers;
            console.log(cloudChildUsers);
            console.log(childUserArr);
            if (cloudChildUsers) {
                if (cloudChildUsers.length != childUserArr.length) {
                    CloudDB.updataChildUsers(childUserArr);
                }
            } else {
                CloudDB.updataChildUsers(childUserArr);
            }
        }
        self.gameController.setWeChatUser();
        self.startGame();
    },

    onCloudGameData(dataArr) {
        const self = this;
        console.log("onCloudGameData");
        if (dataArr.length > 0) {
            console.log("获取到了用户游戏数据");
            var data = dataArr[0];
            CloudDB.saveDBID(data._id);
            console.log(data);
            DataCenter.saveCloudData(data);
            // 获取子用户
            CloudDB.getChildUserData(function (err, dataArr) {
                if (!err) {
                    self.onChildUserData(dataArr);
                }
            });
        } else {
            console.log("未获取到用户数据，用户第一次进入游戏");
            var launchOptions = WeChatUtil.getLaunchOptionsSync();
            var referrer;
            switch (launchOptions.scene) {
                case 1007:
                case 1008:
                    if (launchOptions.query && launchOptions.query.openid) {
                        // 推荐人
                        if (launchOptions.query.openid != openID) {
                            referrer = launchOptions.query.openid;
                        } else {
                            console.log("点击自己分享的卡片进入游戏");
                        }
                    } else {
                        console.log("没有推荐人");
                    }
                    break;
                default:
                    break;
            }
            CloudDB.add({
                gamedata: {},
                WeChatUserInfo: userData.userInfo,
                referrer: referrer
            });
            self.gameController.setWeChatUser();
            self.startGame();
        }
    },

    onOpenID(openID) {
        const self = this;
        console.log("onOpenID");
        let DataMap = DataCenter.DataMap;
        DataCenter.setDataByKey(DataMap.OPENID, openID);
        // 从云数据库中获取用户数据
        console.log("使用openID从云数据库中获取用户数据");
        CloudDB.getUserData(function (err, dataArr) {
            if (!err) {
                self.onCloudGameData(dataArr);
            }
        });
    },

    onWeChatUserInfo(userData) {
        const self = this;
        console.log("onWeChatUserInfo");
        let DataMap = DataCenter.DataMap;
        DataCenter.setDataByKey(DataMap.WXUserInfo, userData.userInfo);
        wx.cloud.callFunction({
            name: 'login', // 需调用的云函数名
            data: userData, // 传给云函数的参数
            complete: res => { // 成功回调
                if (res.result) {
                    var openID = res.result.OPENID;
                    console.log("openID = " + openID);
                    if (openID) {
                        self.onOpenID(openID);
                    }
                } else {
                    console.log("requestID = " + res.requestID + ", errMsg = " + res.errMsg);
                }
            },
        })
    },

    login () {
        const self = this;
        console.log("login");
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            WeChatUtil.getUserInfo(function (bSuccess, userData) {
                console.log(userData);
                if (userData) {
                    self.onWeChatUserInfo(userData);
                }
            });
        } else {
            // DataCenter.saveCloudData({
            //     gamedata: { curGold: 100, monsterInfo: { lv: 2, killCount: 1 } }
            // });
            self.startGame();
        }
    },

    startGame () {
        const self = this;
        console.log("开始游戏逻辑");
        self.bg.zIndex = 0;
        self.uiRoot.active = true;
        self.gameController.onGameStart();
    },
});
