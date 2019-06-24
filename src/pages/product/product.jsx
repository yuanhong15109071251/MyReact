/* 商品管理 */

import React, { Component } from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import Home from './home'
import AddUpdate from './addupdate'
import Detail from './detail'
import './product.less'
export default class Product extends Component {
    render() {
        return (
           <Switch>
               <Route exact path="/product" component={Home}/>
               <Route path="/product/addupdate" component={AddUpdate}/>
               <Route path="/product/detail" component={Detail}/>
               <Redirect to="/product"/>
           </Switch>
        )
    }
}
