import LoginMgr from "./public/loginMgr";
import UserMgr from "./public/userMgr";
import DataMgr from "./public/dataMgr";
import BoxMgr from "./public/boxMgr";
import EffectMgr from "./public/effectMgr";
import ItemMgr from "./public/itemMgr";
import TableMgr from "./public/tableMgr";
import ShopMgr from "./public/shopMgr";
import RoleMgr from "./public/roleMgr";
import VipMgr from "./public/vipMgr";
import AchievementMgr from "./public/achievementMgr";
import FriendsMgr from "./public/friendsMgr";
import UnsettledMgr from "./public/unsettledMgr";
import gmMgr from "./public/gmMgr";

export default function MgrInit() {
    DataMgr.getInstance();
    TableMgr.getInstance();
    UnsettledMgr.getInstance();
    LoginMgr.getInstance();
    UserMgr.getInstance();
    BoxMgr.getInstance();
    ItemMgr.getInstance();
    EffectMgr.getInstance();
    RoleMgr.getInstance();
    ShopMgr.getInstance();
    VipMgr.getInstance();
    AchievementMgr.getInstance();
    FriendsMgr.getInstance();
    gmMgr.getInstance();

}
