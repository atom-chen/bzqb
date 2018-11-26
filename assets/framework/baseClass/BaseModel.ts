export default class BaseModel {
    constructor() {

    }
     /**
     * 字符串转换
     * @param content 内容
     * @param keyword 关键字
     * @param ReplaceWords 替换字数组
     */
    stringReplace(content: string, keyword: string, ReplaceWords: string[]) {
        for (let i = 0; i < ReplaceWords.length; i++) {
            content = content.replace(keyword, ReplaceWords[i])
        }
        return content;
    }
}