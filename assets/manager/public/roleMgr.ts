import BaseMgr from "../../framework/baseClass/BaseMgr";
import { role } from "./interface/iRole";
import GameNet from "../../framework/modules/GameNet";
import Package from "../../framework/net/package";
import { dataids } from "../../framework/net/dataids";
import UserMgr from "./userMgr";
import { enums } from "../enums";
/*
author: 陈斌杰
日期:2018-11-13 20:03:14
*/

export default class RoleMgr extends BaseMgr {
	public isFirst: boolean = false;
	public roleCfgTab: any = null;						//角色配置表
	public rolesData: role[] = [];						//角色数据
	public choiceRole: role = null;						//当前选择的角色数据
	constructor() {
		super();
		this.routes = {
			"plaza.role.reqRoleList": this.reqRoleList,
			"plaza.role.unlockRole": this.unlockRole,
			"plaza.role.switchRole": this.switchRole,
		};
	}

	// 单例处理
	private static _instance: RoleMgr = null;
	public static getInstance(): RoleMgr {
		if (RoleMgr._instance == null) {
			RoleMgr._instance = new RoleMgr();
		}
		return RoleMgr._instance;
	}

	//向服务器发送角色列表数据请求
	public sendReqRoleListData(): void {
		this.isFirst = true;
		this.send_msg("plaza.role.reqRoleList");
	}

	//获取服务器发送的角色列表数据
	public reqRoleList(msg: Package): void {
		let data = msg.getDataByType(dataids.ID_ROLELIST);
		this.getCfgTab();
		this.initRolesData();
		this.setRolesData(data);
		this.setUsingRoleData();
	}

	//向服务器发送解锁角色请求
	public sendReqUnlockRole(roleId: number): void {
		let msg = {
			itemId: roleId,
		}
		this.send_msg("plaza.role.unlockRole", msg);
	}

	//获取服务器发送的角色解锁数据
	public unlockRole(msg: Package): void {
		let itemData = msg.getDataByType(dataids.ID_ITEM_COUNT);		//碎片解锁需要  设置玩家数据
		let unlockRoleData = msg.getDataByType(dataids.ID_UNLOCK_ROLE);
		this.setRolesData(unlockRoleData);
	}

	//向服务器发送角色使用请求
	public sendReqUsingRole(roleId: number): void {
		let msg = {
			autoId: roleId,
		}
		this.send_msg("plaza.role.switchRole", msg);
	}

	//获取服务器发送的角色使用数据
	public switchRole(msg: Package): void {
		let itemData = msg.getDataByType(dataids.ID_EQUIP_ROLE);
		this.setRoleUsingData(itemData.autoId);
		this.setUsingRoleData();
	}

	//获取角色配置表
	public getCfgTab(): void {
		this.roleCfgTab = this.getConfigSync("role_juese").json;
	}

	//初始化角色数据
	public initRolesData(): void {
		//初始原始数据
		for (let i = 0; i < this.roleCfgTab.length + 1; i++) {
			let roleData: role = <role>{};
			let roleCfgData: any = this.roleCfgTab[i];
			if (i == this.roleCfgTab.length) {
				roleData.roleId = null;
				return;
			}
			roleData.id = null;
			roleData.roleId = roleCfgData.roleId;
			roleData.isUnlock = false;
			roleData.isUsing = false;
			if (roleCfgData.unlock_chip != null) {
				roleData.itemId = roleCfgData.unlock_chip[0].itemid;
				roleData.roleChipNum = roleCfgData.unlock_chip[0].count;
			} else {
				roleData.itemId = null;
				roleData.roleChipNum = 0;
			}
			roleData.userRoleChipNum = 0;
			roleData.spendGold = roleCfgData.unlock_gold || 0;
			roleData.spendCrystal = roleCfgData.unlock_crystal || 0;
			roleData.spendDiamond = roleCfgData.unlock_diamond || 0;
			roleData.vipLimite = roleCfgData.unlock_vip || 0;
			this.rolesData.push(roleData);
		}
	}

	//设置角色数据
	public setRolesData(data: any): void {
		if (!data) {
			return;
		}
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < this.rolesData.length; j++) {
				if (data[i].itemId == this.rolesData[j].roleId) {
					let roleData: any = this.getRoleCfgDataByItem(data[i].itemId);
					this.rolesData[j].id = data[i].id;
					this.rolesData[j].roleId = data[i].itemId;
					this.rolesData[j].isUnlock = true;
					if (roleData.unlock_chip != null) {
						this.rolesData[j].itemId = roleData.unlock_chip[0].itemid;
						this.rolesData[j].roleChipNum = roleData.unlock_chip[0].count;
					}
					this.rolesData[j].userRoleChipNum = 0;
					this.rolesData[j].spendGold = roleData.unlock_gold;
					this.rolesData[j].spendCrystal = roleData.unlock_crystal;
					this.rolesData[j].spendDiamond = roleData.unlock_diamond;
					this.rolesData[j].vipLimite = roleData.unlock_vip;
				}
			}
		}
	}

	//设置当前使用的角色数据
	public setUsingRoleData(): void {
		for (let i = 0; i < this.rolesData.length; i++) {
			let roleId = UserMgr.getInstance().user.roleId;
			if (roleId == this.rolesData[i].id) {
				this.choiceRole = this.rolesData[i];
				this.choiceRole.id = roleId;
				this.choiceRole.isUsing = true;
				break;
			}
		}
	}

	//设置当前的角色为使用角色
	public setRoleUsingData(roleId: number): void {
		for (let i = 0; i < this.rolesData.length; i++) {
			let role = this.rolesData[i];
			if (role.id == roleId) {
				role.isUsing = true;
			} else {
				role.isUsing = false;
			}
		}
	}

	//根据itemid获取配置表中角色数据
	public getRoleCfgDataByItem(itemId: number): void {
		for (let i = 0; i < this.roleCfgTab.length; i++) {
			let rolefata = this.roleCfgTab[i];
			if (itemId == rolefata.roleId) {
				return rolefata;
			}
		}
	}

	//根据itemid获取角色数据
	public getRoleDataByItem(itemId: number): any {
		for (let i = 0; i < this.rolesData.length; i++) {
			let rolefata = this.rolesData[i];
			if (itemId == rolefata.roleId) {
				return rolefata;
			}
		}
	}

	//领取邮件奖励获得的特技数据处理
	public refreshData(data: any): void {
		if (!this.rolesData || this.rolesData.length == 0) {
			return;
		}
		for (let key in data) {
			if (Number(key) == enums.Get_Chip) {
				for (let i = 0; i < data[key].length; i++) {
					for (let j = 0; j < this.rolesData.length; j++) {
						let roleData = this.rolesData[j];
						if (data[key][i].itemId == roleData.itemId) {
							roleData.userRoleChipNum += data[key][i].amount;
							break;
						}
					}
				}
			}
		}
	}
}