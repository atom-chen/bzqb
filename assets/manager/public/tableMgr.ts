import Loader from "../../framework/modules/Loader";

export default class TableMgr {
    //单例处理
    private static _instance: TableMgr = null;

    public static getInstance(): TableMgr {
        if (TableMgr._instance == null) {
            TableMgr._instance = new TableMgr();
        }
        return TableMgr._instance;
    }
    private _tableList: { [table: string]: any[] } = {};
    private _curTable: any[];
    /**
     * @param name 配表名
     * @param condition 查询条件
     */
    public search(name: string, condition: { [key: string]: any }): any
    public search(name: string, condition: { [key: string]: any }[]): any[]
    public search(name: string, condition: any): any {
        if (!this._tableList.hasOwnProperty(name)) {
            this._tableList[name] = Loader.getInstance().getRes(`config/${name}`, cc.JsonAsset).json;
        }
        this._curTable = this._tableList[name];
        if (!this._curTable) {
            console.error("没有此配表!");
            return null;
        }
        if (Array.isArray(condition)) {
            let arr = [];
            for (let i = 0; i < condition.length; ++i) {
                arr.push(this._query(condition[i]));
            }
            return arr;
        } else {
            return this._query(condition);
        }
    }

    private _query(obj: any) {
        let [key, value] = Object.entries(obj)[0];
        let data = this._curTable.find(v => v[key] == value);
        return data ? data : null;
    }
}