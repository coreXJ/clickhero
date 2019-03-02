// var ZoneCfg = [
//     "花果山",
//     "斜月三星洞",
//     "东海龙宫",
//     "阴曹地府",
//     "天宫",
//     "五行山",
//     "高老庄",
//     "流沙河",
//     "双叉岭",
//     "莲花洞",
//     "黑风山",
//     "白骨洞",
//     "迷识林",
//     "波月洞",
//     "五庄观",
//     "乌鸡国",
//     "火云洞",
//     "车迟国",
//     "灵感庙",
//     "盘丝洞",
//     "聚仙庵",
//     "火焰山",
//     "女儿国",
//     "狮驼岭",
//     "芭蕉洞",
//     "碧波潭",
//     "陷空山",
//     "摩云洞",
//     "黄花观",
//     "镇海寺",
//     "如意庵",
//     "莫耐山",
//     "蟒妖岭",
//     "黯黮林",
// ]

var obj = [
    { zone: "花果山", bossName: "寅将军", des:"陷虎穴金星解厄 双叉岭伯钦留僧", resNum:"1" },
    { zone: "鹰愁涧", bossName: "小白龙", des:"蛇盘山诸神暗佑 鹰愁涧意马收缰", resNum:"2" },
    { zone: "黑风山", bossName: "黑熊怪", des:"观音院僧谋宝贝 黑风山怪窃袈裟", resNum:"3" },
    { zone: "黑风山", bossName: "苍狼凌虚子", des:"孙行者大闹黑风山 观世音收伏熊罴怪", resNum:"4" },
    { zone: "高老庄", bossName: "猪八戒", des:"观音院唐僧脱难 高老庄行者降魔", resNum:"46" },
    { zone: "黄风岭", bossName: "黄风大王", des:"黄风岭唐僧有难 半山中八戒争先 ", resNum:"5" },
    { zone: "流沙河", bossName: "沙悟净", des:"八戒大战流沙河 木叉奉法收悟净", resNum:"6" },
    { zone: "花果山", bossName: "镇元大仙", des:"万寿山大仙留故友 五庄观行者窃人参", resNum:"7" },
    { zone: "五庄观", bossName: "白骨精", des:"尸魔三戏唐三藏 圣僧恨逐美猴王 ", resNum:"8" },
    { zone: "黑松林", bossName: "黄袍怪", des:"花果山群妖聚义 黑松林三藏逢魔", resNum:"9" },
    { zone: "平顶山", bossName: "金角大王", des:"平顶山功曹传信 莲花洞木母逢灾", resNum:"10" },
    { zone: "平顶山", bossName: "伶俐鬼", des:"魔王巧算困心猿 大圣腾那骗宝贝", resNum:"11" },
    { zone: "平顶山", bossName: "九尾狐狸", des:"外道施威欺正性 心猿获宝伏邪魔", resNum:"12" },
    { zone: "平顶山", bossName: "狮子精", des:"一粒金丹天上得 三年故主世间生", resNum:"13" },
    { zone: "火云洞", bossName: "红孩儿", des:"婴儿戏化禅心乱 猿马刀归木母空", resNum:"14" },
    { zone: "黑水河", bossName: "黑水河鼍龙", des:"黑河妖孽擒僧去 西洋龙子捉鼍回", resNum:"15" },
    { zone: "车迟国", bossName: "虎力大仙", des:"法身元运逢车力 心正妖邪度脊关", resNum:"16" },
    { zone: "车迟国", bossName: "鹿力大仙", des:"", resNum:"17" },
    { zone: "车迟国", bossName: "羊力大仙", des:"", resNum:"18" },

    { zone: "通天河", bossName: "灵感大王", des:"圣僧夜阻通天水金木垂慈救小童", resNum:"19" },
    { zone: "金兜山", bossName: "青牛精兕怪", des:"情乱性从因爱欲 神昏心动遇魔头", resNum:"20" },
    { zone: "女儿国", bossName: "如意真仙", des:"禅主吞餐怀鬼孕 黄婆运水解邪胎", resNum:"21" },
    { zone: "琵琶洞", bossName: "蝎子精", des:"色邪淫戏唐三藏 性正修持不坏身", resNum:"22" },
    { zone: "花果山", bossName: "假美猴王", des:"真行者落伽山诉苦 假猴王水帘洞誊文", resNum:"23" },
    { zone: "翠云山", bossName: "铁扇公主", des:"唐三藏路阻火焰山 孙行者一调芭蕉扇", resNum:"24" },
    { zone: "翠云山", bossName: "牛魔王", des:"牛魔王罢战赴华筵 孙行者二调芭蕉扇", resNum:"25" },
    { zone: "翠云山", bossName: "玉面狐狸", des:"", resNum:"26" },
    { zone: "碧波潭", bossName: "万圣龙王", des:"", resNum:"27" },
    { zone: "祭赛国", bossName: "九头虫", des:"二僧荡怪闹龙宫 群圣除邪获宝贝", resNum:"28" },
    { zone: "小雷音寺", bossName: "黄梅老佛", des:"妖邪假设小雷音 四众皆遭大厄难", resNum:"29" },
    { zone: "七绝山", bossName: "蟒蛇精", des:"拯救驼罗禅性稳 脱离秽污道心清", resNum:"30" },
    { zone: "麒麟山", bossName: "金毛吼", des:"妖魔宝放烟沙火 悟空计盗紫金铃", resNum:"31" },
    { zone: "盘丝洞", bossName: "蜘蛛精", des:"盘丝洞七情迷本 濯垢泉八戒忘形", resNum:"32" },

    { zone: "盘丝洞", bossName: "蜈蚣精", des:"情因旧恨生灾毒 心主遭魔幸破光", resNum:"33" },
    { zone: "狮驼洞", bossName: "狮子精", des:"长庚传报魔头狠 行者施为变化能", resNum:"34" },
    { zone: "狮驼洞", bossName: "白象精", des:"", resNum:"35" },
    { zone: "狮驼洞", bossName: "大鹏怪", des:"", resNum:"36" },
    { zone: "比丘国", bossName: "白鹿精", des:"比丘怜子遣阴神 金殿识魔谈道德 ", resNum:"37" },
    { zone: "比丘国", bossName: "白面狐狸", des:"", resNum:"38" },
    { zone: "陷空山无底洞", bossName: "白毛老鼠精", des:"姹女育阳求配偶 心猿护主识妖邪", resNum:"39" },
    { zone: "隐雾山", bossName: "南山大王", des:"心猿妒木母 魔主计吞禅", resNum:"40" },
    { zone: "豹头山", bossName: "黄狮精", des:"黄狮精虚设钉钯宴 金木土计闹豹头山", resNum:"41" },
    { zone: "竹节山", bossName: "九头狮子", des:"师狮授受同归一 盗道缠禅静九灵", resNum:"42" },
    { zone: "金平府", bossName: "辟尘大王", des:"金平府元夜观灯 玄英洞唐僧供状", resNum:"43" },
    { zone: "金平府", bossName: "辟暑大王", des:"", resNum:"44" },
    { zone: "金平府", bossName: "辟寒大王", des:"", resNum:"45" },
    // { zone: "天竺国", bossName: "玉兔精", des:"", resNum:"1" },
]

module.exports = obj;