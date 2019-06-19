/* 
用来存储local数据工具的模块
*/

import store from 'store'
export function saveUser(user){
    // localStorage.setItem("User-key" ,JSON.stringify(user))
    store.set('User-key',user)
}

export function  getUser(){
// return (
//     JSON.parse(localStorage.getItem( "User-key") || '{}' )
// )
  return store.get( "User-key") ||  {}

}
//删除
export function removeUser(){
  store.remove('user')
}