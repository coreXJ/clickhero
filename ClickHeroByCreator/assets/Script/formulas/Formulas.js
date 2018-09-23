
var bigPow = function (m, n) {
    let a = new BigNumber(m);
    let b = new BigNumber(n);
    return a.pow(b);
}
var bigMax = function (m, n) {
    let a = new BigNumber(m);
    let b = new BigNumber(n);
    return a.isGreaterThanOrEqualTo(b) ? a : b;
}
var bigMin = function (m, n) {
    let a = new BigNumber(m);
    let b = new BigNumber(n);
    return a.isGreaterThanOrEqualTo(b) ? b : a;
}
cc.Class({
    statics: {
        //计算点击伤害 for hero
        getClickDPS(lv, times){
            // let DPS = baseDPS * lv;
            let DPS = new BigNumber(lv * times);
            return DPS;
        },
        // 计算DPS for hero
        getDPS(baseDPS,lv,times){
            // let DPS = baseDPS * lv;
            let DPS = baseDPS.times(lv * times);
            return DPS;
        },
        // 升级点击英雄金币 for hero
        getClickHeroCost(lv){
            if (lv <= 15) {
                return bigPow(1.07, lv - 1).times(5 + lv).integerValue();
                // return Math.floor((5 + lv) * Math.pow(1.07, lv - 1)); 
            } else if (lv >= 16) {
                return bigPow(1.07, lv - 1).times(20).integerValue(); 
                // return Math.floor(20 * Math.pow(1.07, lv - 1));
            }
        },
        // 升级DPS英雄金币 for hero
        getHeroCost(baseCost, lv){
            return bigPow(1.07, lv - 1).times(baseCost).integerValue();
            // return Math.floor(baseCost * Math.pow(1.07,lv - 1));
        },
        // 计算怪物HP for monster
        getMonsterHP(lv) {
            var boss = lv % 5 == 0 ? 10 : 1;
            var hp;
            if (lv <= 140) {
                // hp = 10 * (lv - 1 + Math.pow(1.55,lv-1)) * boss;
                hp = bigPow(1.55, lv - 1).plus(lv - 1).times(boss * 10);
            } else if (lv <= 500) {
                // hp = 10*(139+Math.pow(1.55,139)*Math.pow(1.145,lv-140))*boss;
                hp = bigPow(1.55, 139).times(bigPow(1.145, lv - 140)).plus(139).times(boss * 10);
            } else if (lv <= 200000) {
                // var P = 1;
                // for (var i = 501; i < lv; i++){
                //     P *= (1.145 + 0.001* Math.floor((i-1)/500))
                // }
                // hp = 10 * (139 + Math.pow(1.55,139) * Math.pow(1.145,360)*P)*boss
                let P = new BigNumber(1);
                for (var i = 501; i < lv; i++) {
                    P = P.times(1.145 + 0.001 * Math.floor((i - 1) / 500));
                }
                hp = bigPow(1.55, 139).times(bigPow(1.145, 360)).times(P).plus(139).times(boss * 10);
            } else {
                // hp = (Math.pow(1.545,lv-200001)*1.24*Math.pow(10,25409)+(lv - 1)*10)
                hp = bigPow(1.545, lv - 200001).times(bigPow(10, 25409)).times(1.24).plus((lv - 1) * 10);
            }
            // return Math.ceil(hp);
            return hp.integerValue();
        },
        // 计算怪物金币 for monster
        // hp = getMonsterHP(lv);
        getMonsterGold(lv, hp) {
            let result = hp.div(15).times(bigMin(3, bigPow(1.025, lv)));
            return result.integerValue();
            // return Math.ceil(hp / 15 * Math.min(3,Math.pow(1.025,lv)));
        },
    },
});
