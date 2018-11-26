/**php平台登录模块 */
declare module platSdk {
    /**
     * 设置平台URL
     * @param url 平台URL
     */
    export function setPlatUrl(url: string): void { }
    /**
     * 获取当前平台URL
     */
    export function getPlatUrl(): string { }
    /**
     * 账号登录
     * @param obj 登录参数
     */
    export function login(obj: { data: { username: string, password: string }, success: Function, fail?: Function }): void { }
    /**
     * 注册账号
     * @param obj 注册参数
     */
    export function register(obj: { data: { username: string, password: string }, success: Function, fail?: Function }): void { }
    /**
     * 游客登录
     * @param obj 回调
     */
    export function touristLogin(obj: { success: Function, fail?: Function }): void { }
}