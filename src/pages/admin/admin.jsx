import React from 'react'


import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom'
import MemoryUtils from '../../utils/memoryUtils'
import Home from '../home/home'
import Category from '../category/category'
import Line from '../charts/line'
import Bar from '../charts/bar'
import Pie from '../charts/pie'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import LeftNav from '../../components/left-nav/index'
import AdminHeader from "../../components/header/index"
const { Footer, Sider, Content } = Layout;

export default class Admin extends React.Component {

  render() {
    const user = MemoryUtils.user
    if (!user._id) {
      return <Redirect to="/login" />
    }
    return (
      <Layout style={{ minHeight: "100%", color: "#fff" }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <AdminHeader/>
          <Content  style={{ margin: 35, backgroundColor: "#fff", color: "red" }} >
            <Switch>
              <Route path="/home" component={Home}></Route>
              <Route path="/category" component={Category}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/role" component={Role}></Route>
              <Route path="/charts/bar" component={Bar}></Route>
              <Route path="/charts/pie" component={Pie}></Route>
              <Route path="/charts/line" component={Line}></Route>
              <Route path="/product" component={Product}></Route>
              <Redirect to="/home"/>
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>使用谷歌浏览器效果更好</Footer>
        </Layout>
      </Layout>
    )
  }
}
