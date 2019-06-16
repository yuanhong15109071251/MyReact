/*
包含n个接口请求函数的模块
每个函数返回promise
 */
import ajax from './ajax'
//http://localhost:5000
const BASE = ""
// 登陆
// export function reqLogin() {
//     //调用ajax请求函数发请求
//     ajax(BASE + '/login', { username, password }, 'POST')
// }
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

//添加用户
export const reqUser = (user) =>ajax(BASE + '/manage/user/add',user,'POST')

//测试

reqLogin('admin','admin').then(result=>{
    console.log('result',result)
})