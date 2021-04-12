/****   http.js   ****/
// 导入封装好的axios实例
import request from './request'
const http ={
    /**
     * @param url 请求地址
     * @param params 请求参数
     * config: 自定义配置
     */
    get(url, params, config) {
        const getConfig = {}
        if (params) {
            Object.assign(getConfig, {
                params
            })
        }
        if (config) Object.assign(getConfig, config)

        return request.get(url, getConfig)
    },
    post(url, data, config) {
        return request.post(url, data, config)
    },
    put(url, data, config) {
        return request.put(url, data, config)
    },
    delete(url, params, config) {
        const delConfig = {}
        if (params) {
            Object.assign(delConfig, {
                params
            })
        }
        if (config) Object.assign(delConfig, config)

        return request.delete(url, delConfig)
    }
}
//导出
export default http

//获取地址栏参数
export function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    //参数只能是英文的
    //if (r != null) return unescape(r[2]); return null;
    //参数可以是英文也可以是中文
    if(r!=null)return decodeURI(r[2]); return null;
}
