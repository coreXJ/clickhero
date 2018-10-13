var unitArr = ["",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    "aa","bb","cc","dd","ee","ff","gg","hh","ii","jj","kk","ll","mm","nn","oo","pp","qq","rr","ss","tt","uu","vv","ww","xx","yy","zz",
    "AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ",
    "aaa","bbb","ccc","ddd","eee","fff","ggg","hhh","iii","jjj","kkk","lll","mmm","nnn","ooo","ppp","qqq","rrr","sss","ttt","uuu","vvv","www","xxx","yyy","zzz",
    "AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ"
];
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

        // "1.0000e+0"  "1.0000" 0/5=0;0%4=0
        // "1.1000e+1"  "11.000" 1/5=0;1%4=1
        // "1.1200e+2"  "112.00" 2/5=0;2%4=2
        // "1.1230e+3"  "1123.0" 3/5=0;3%4=3
        // "1.1234e+4"  "11234" 4/5=0;4%5=4
        // "1.1234e+5"  "1.1234a" 1a=1e+5;5/5=1;5%5=0
        // "1.1234e+6"  "11.234a" 6/5=1;6%4=1
        // "1.1234e+7"  "112.34a" 7/5=1;7%4=2
        // "1.1234e+8"  "1123.4a" 8/5=1;8%4=3
        // "1.1234e+9"  "11234a"  9/5=1;9%4=4
        // "1.1234e+10"  "1.1234b" 1b = 1e+10
        // "1.1234e+11"  "11.234b"
        // "1.1234e+12"  "112.34b"
        // "1.1234e+13"  "1123.4b"
        // "1.1234e+14"  "11234b"
        // "1.1234e+15"  "1.1234c" 1c = 1e+15
        formatBigNumber (bigNumber) {
            if (BigNumber.isBigNumber(bigNumber)) {
                var c = 5;
                var str = bigNumber.toExponential(4);
                var arr = str.split("e+");
                var number = new Number(arr[0]);
                var power = new Number(arr[1]);
                var int = Math.floor(power/c);
                if (int < unitArr.length) {                
                    var rem = power%c;
                    var unit = unitArr[int];
                    var num = Math.pow(10, rem) * number;
                    var result = num.toFixed(c-1-rem) + unit;
                    // console.log(str + " = " + result);
                    return result;
                } else {
                    return str;
                }
            }
        },
        
        // 在 rate 概率下是否命中随机事件，rate 为百分数，大于等于0，小于100
        isHitRandom (rate) {
            if (rate >= 100) {
                return true;
            } else if (rate >= 0) {
                if (Math.random()*100 < rate) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            
        },
        
    },
});
