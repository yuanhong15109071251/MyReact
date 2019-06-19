/*
包含n个接口请求函数的模块
每个函数返回promise
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import{message} from 'antd'
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

// reqLogin('admin','admin').then(result=>{
//     console.log('result',result)
// })
/* 获取天气的JSONP请求 */

export const getWeather = (location) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  
    return new Promise((resolve, reject) => {
      // 执行请求
      setTimeout(() => {
        jsonp(url, {}, (error, data) => {
          if (!error && data.status === 'success') {
            const {
              dayPictureUrl,
             weather} = data.results[0].weather_data[0]
            // 成功了, 调用reolve()指定成功的值
            resolve(
             { dayPictureUrl,
                weather}
            )
          } else {
            message.error('获取天气信息失败!')
          }
        })
      }, 2000)
    })
    
  }
/* 
解决GET类型的跨域问题
JSONP请求原理  他不是ajax请求，是普通的http请求
动态生成<script src="被请求的接口？calllback=fn">浏览器会自动发送一个普通的http请求（客户端同时会准备一个回调函数），服务器端：处理请求返回一个函数调用的js语句 参数就是要返回的数据，，浏览器端：接收到响应后自动执行js代码调用之前准备好的回调函数，标签
src指向后台请求的一个接口   后台返回的是一个函数调用的语句，数据通过实参新式传给你

*/
// getWeather('北京')

/* 获取分类列表   一级/二级*/
export const  reqCategorys = (parentId)=>ajax(BASE + '/manage/category/list',{parentId})


/* 添加分类 */
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')
/* 更新分类的名称 */

export const reqUpdateCategory = ({categoryId,categoryName})=>ajax(BASE+ '/manage/category/update',{categoryId,categoryName},"POST")