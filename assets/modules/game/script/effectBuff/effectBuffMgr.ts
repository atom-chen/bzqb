
// enum buffTypeEnum{
// 	// 通常
// 	"normal" = 0,
// 	// 治愈
// 	"cure" = 1,
// 	// 中毒
// 	"poisoning" = 2,
// 	// 灼烧
// 	"burn" = 3,
// }
let buffTypeEnum = {
	// 通常
	"normal":"0",
	// 治愈
	"cure" : "1",
	// 中毒
	"poisoning": "2",
	// 灼烧
	"burn": "3",

};

// buff控制器
export default class buffEffectMgr{
	buffEnum:any;
	// 当前buff类型
	nowBuffType:any;
	constructor(){
		this.buffEnum = {
			"1":0,
			"2":0,
			"3":0
		};
	}
	// 施加buff
	addBuff(buffType:string){
		this.nowBuffType[buffType] = 2;
	}

	// 减去buff
	subBuff(buffType){
		this.nowBuffType[buffType] > 0 && (this.nowBuffType[buffType] --);
	}

	// buff 结算
	buffSettle(){
		for(let buffType in this.nowBuffType){
			let buffTimce = this.nowBuffType[buffType];
			if(buffTimce > 0){
				// TODO buff效果计算
			}
		}
	}
}