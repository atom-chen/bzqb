import BaseMgr from "../../framework/baseClass/BaseMgr";

export default class GameMgr extends BaseMgr {
    private static _instance: GameMgr = null;
    public static getInstance(): GameMgr {
        if (GameMgr._instance == null) {
            GameMgr._instance = new GameMgr();
        }
        return GameMgr._instance;
    }

    constructor() {
        super();
        this.routes = {
            
        }
    }
}
