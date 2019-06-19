/* 
左侧导航
*/

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './index.less'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'
const { SubMenu, Item } = Menu;
class LeftNav extends Component {
    /* 
   根据menu中数据中数组生成包含<Item> / <SubMenu>的数组
   关键技术: array.map() + 递归调用
   */
    getMenuNode = (menuList) => {
        const path = this.props.location.pathname

        return menuList.map(item => {

            if (!item.children) {
                return (
                    <Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Item>
                )
            } else {
                const cItem = item.children.find((cItem, index) => cItem.key === path)
                if (cItem) { // 当前请求的是某个二级菜单路由
                    this.openKey = item.key
                }

                return (

                    <SubMenu key={item.key}

                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {
                            this.getMenuNode(item.children)
                        }
                    </SubMenu>
                )

            }
        })

    }
    componentWillMount() {
       
        this.a = this.getMenuNode(menuList) 
        }
    render() {
        const selectedKey = this.props.location.pathname
        const openKey = this.openKey
        return (
            <div className="leftnav">
                <Link to="/home" className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[selectedKey]}
                    defaultOpenKeys={[openKey]}
                >
                    {//定义一个方法 根据数据的数组 来生成一个标签的数组 直接可以列表显示
                     this.a
                    }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)