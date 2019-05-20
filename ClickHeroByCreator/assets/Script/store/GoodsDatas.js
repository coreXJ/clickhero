// 管理商店物品的数据源
var Goods = require("Goods");

var Datas = {}

Datas.init = function() {
    var cloudInfo = DataCenter.getCloudDataByKey(DataCenter.KeyMap.goodsList);
    // 购买次数，永久效果的商品需要记录并持久化
    Datas.buyCounts = cloudInfo || []
    Datas.datas = [
        new Goods().init(0),
        new Goods().init(14),
        new Goods().init(1),
        new Goods().init(6),
        new Goods().init(2),
        new Goods().init(3),
        new Goods().init(4),
        new Goods().init(5),
        new Goods().init(7),
        new Goods().init(8),
        new Goods().init(9),
        new Goods().init(10),
        new Goods().init(15),
        new Goods().init(11),
        new Goods().init(12),
        new Goods().init(13),
    ];
    Datas.refresh()
}

Datas.refresh = function(){
    Datas.buyCounts.forEach(e => {
        var count = e.count
        if (e.id == 1) {
            GameData.gdDayDPSTimes = Math.pow(1.2,count)
        } else if (e.id == 14) {
            GameData.gdDayGoldTimes = Math.pow(1.2,count)
        } else if (e.id == 2) {
            GameData.gdDoubleGold = count>0?2:1
        } else if (e.id == 3) {
            GameData.gdDoubleDPS = count>0?2:1
        } else if (e.id == 4) {
            GameData.gdAutoClick = count
        } else if (e.id == 7) {
            GameData.gdLeaveTimes = 1 + count*0.5
        } else if (e.id == 8) {
            GameData.gdAncientSale = Math.pow(0.95,count)
        } else if (e.id == 9) {
            GameData.gdDPSTimes = 1 + count
        } else if (e.id == 10) {
            GameData.gdGoldTimes = 1 + count*10
        } else if (e.id == 15) {
            GameData.gdSoulTimes = 1 + count*10
            console.log("GameData.gdSoulTimes1"+GameData.gdSoulTimes);
        } else if (e.id == 11) {
            GameData.gdPBossTimes = count*0.25 + 1
        } else if (e.id == 12) {
            GameData.gdPBossTSTimes = count*0.75 + 1
        } else if (e.id == 13) {
            GameData.gdTreasureOddsTimes = count + 1
        }
    });
}

Datas.addBuyCount = function(id) {
    var bc
    Datas.buyCounts.forEach(e => {
        if (e.id == id) {
            bc = e
        }
    })
    if (!bc) {
        bc = {id : id,count : 0}
        Datas.buyCounts.push(bc)
    }
    bc.count ++
    bc.lastBuyDate = Datas.getTodayStr()
    Datas.refresh()
}

Datas.getBuyCount = function(id){
    var count = 0
    Datas.buyCounts.forEach(e => {
        if (e.id == id) {
            count = e.count
        }
    })
    return count
}
Datas.todayHasBuy = function(id){
    console.log("todayHasBuy"+id);
    let result = false
    Datas.buyCounts.forEach(e => {
        if (e.id == id) {
            console.log(e);
            console.log(String(e.lastBuyDate) +" " + Datas.getTodayStr());
            result = Datas.getTodayStr() == String(e.lastBuyDate)
        }
    })
    console.log("result:"+result);
    return result
}
Datas.getTodayStr = function(){
    let date = new Date()
    let str = date.getFullYear() +"-"+ date.getMonth() +"-"+ date.getDate()
    return str
}

module.exports = Datas