/*
能发送ajax请求的函数模块
  包装axios
  函数的返回值是promise对象
  axios.get()/post()返回的（return）就是promise对象
  返回自己创建的promise对象:
      统一处理请求异常
      异步返回结果数据, 不是包含结果数据的response,是response.data =result



  自己创建的promise有我们自己通过调用resolve()或者reject()来指定结果    
  如果是别人给的promise   通过得到这个promise对象后   promise.then()来指定成功或失败的回调
 */
import axios from 'axios'

import { message } from 'antd'

export default function ajax(url, data = {}, type = "GET") {
    return new Promise((resolve, ) => {

        let promise
        if (type === "GET") {
            //发送get请求
            promise = axios.get(url, {
                params: data   //指定params参数
            })
        } else {
            //发送post请求
            promise = axios.post(url, data)
        }
        promise.then(
            //成功 
            response => { resolve(response.data) },
            //失败 不调用 reject 显示错误的提示文本
            error => { 
                // alert('请求出错: ' + error.message)
                message.error('请求错误: ' + error.message)
             }
        )
    })
}
// async function login() {
//     const result = await ajax('./login', { username: 'admin', password: 'admin' }, 'POST')

//     if (result.status === 0) {
   
//     } else {

//     }
// }
