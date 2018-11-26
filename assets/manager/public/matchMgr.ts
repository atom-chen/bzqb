import BaseMgr from "../../framework/baseClass/BaseMgr";
import Package from "../../framework/net/package";

export default class MatchMgr extends BaseMgr {
    constructor() {
        super();
        this.routes = {
            'match.match.match': this._match,
            'match.match.stopMatch': this._stopMatch
        }
    }
    // 网络消息回调
    private _match(msg: Package): void {

    }

    private _stopMatch(msg: Package): void {

    }
    // end
    public sendMatch(): void {
        this.send_msg('match.match.match');
    }

    public sendStopMatch(): void {
        this.send_msg('match.match.stopMatch');
    }

    private static _instance: MatchMgr = null;
    public static getInstance(): MatchMgr {
        if (MatchMgr._instance == null) {
            MatchMgr._instance = new MatchMgr();
        }
        return MatchMgr._instance;
    }
}