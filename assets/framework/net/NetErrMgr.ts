import { errorcode, errortip } from "./errorcode";
import Emitter from "../modules/Emitter";
import GameNet from "../modules/GameNet";
import ModuleMgr from "../modules/ModuleMgr";

export default class NetErrMgr {
    //单例处理
    private static _instance: NetErrMgr = new NetErrMgr();
    public static getInstance(): NetErrMgr {
        return NetErrMgr._instance;
    }

    dealWithError(code) {
        if (code) {
            switch (code) {
                case errorcode.ERR_LACK_ROLE:
                    Emitter.getInstance().emit("goToCreateRole");
                    break;
                case errorcode.ERR_TOKEN_ERR:
                    GameNet.getInstance().clear();
                    Emitter.getInstance().emit("platTokenError");
                    break;
                default:
                    ModuleMgr.getInstance().showTipBox(errortip[code] || "未知错误!");
            }
            return true;
        }
        return false;
    }
}