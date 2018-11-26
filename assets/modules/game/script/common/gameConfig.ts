/*
author: 黄凯
日期:2018-11-19
*/

// gameConfig.ts
const config = {
	// 网络帧数
	netFrame:20,
	// 过程等待时间
	waitTime:15,
	// 最多卡牌张数 最后一张卡牌不能使用
	maxCard:6,
	// 人物举炮高度
	shootStartPoi:20,
	// 人物Y轴偏移
	playerOffsetY:50,

	// 导弹 对应的索引值
	missileType:{
		// 通常弹
		normal:0,
		// 飞机
		plane:1,
	},
	// 导弹效果
	missileBuffType:{
		// 扣血
		sub:1,
		// 加血
		add:2,
	},
	// 物理配置项
	physicsConfig:{
		// 物理缩放值
		physicsScale:10,
		// 重力
		gravity:{
			x:0,
			y:-1
		},
	},
	// 碰撞配置
	colliderConfig:{
		// 环境包围盒tag
		bgBound:9,
		// 弹坑的碰撞
		// boomCollider:8,
	},
	// 玩家的配置
	playerConfig:{
		// 每帧移动速度
		trunMoveSpeed:1,
		// 每帧移动能量消耗
		trunMovePower:1,
		// 移动能量最大值
		maxMovePower:100,
	},
	// 绑定事件
	fightEvent:{
		// 发射导弹事件
		"onMissileShoot":"onMissileShoot",
		// 导弹死亡
		"onMissileDead":"onMissileDead",
		// 碰撞结算
		"colliderSettle":"colliderSettle",
		// 网络帧事件
		"netFrame":"netFrame",
		// 有顺序的update
		"netUpdate":"netUpdate",
		// 切换流程
		"changeProcess":"changeProcess",

		// ------UI部分的效果------

		// 显示倒计时
		"showCountDown":"showCountDown",
		// 隐藏倒计时
		"hideCountDown":"hideCountDown",
		// 更新倒计时
		"updateCountDown":"updateCountDown",

		// 切换显示 隐藏 自己的操作ui
		"taggerMyCtrlUi":"taggerMyCtrlUi",
		// 移动我的ui
		"moveMyCtrlUi":"moveMyCtrlUi",
		// 更新我的行动能量条
		"updateMoveRange":"updateMoveRange",
		// 切换我的卡牌 (生成)
		"onCardChange":"onCardChange",

		// -------相机部分--------

		// 相机当前趋近的点
		"setNowLerpPoi":"setNowLerpPoi",
		// 相机当前跟随的点
		"setNowGoPoi":"setNowGoPoi",
		// 设置焦距
		"setZoomRatio":"setZoomRatio",



	}
};

export default config;

