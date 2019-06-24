/* 
左侧导航
*/

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './index.less'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu, Item } = Menu;
class LeftNav extends Component {
    /* 
   根据menu中数据中数组生成包含<Item> / <SubMenu>的数组
   关键技术: array.map() + 递归调用
   */
    //判断当前用户是否有指定item的权限
    isAuth = (item) => {
        //首先得到当前用户所有的权限
        const user = memoryUtils.user
      /* 
    1. 如果当前用户是admin
    2. 如果当前item标识为公开
    3. item的key是否在当前用户对应的角色的权限列表中
    4. 如果有item的子节点的权限, 当前item就得存在
    */
    // 1. 如果当前用户是admin
    // 2. 如果当前item标识为公开
    // 3. item的key是否在当前用户对应的角色的权限列表中
    
    if (user.username === 'admin' || item.isPublic || user.role.menus.indexOf(item.key) !== -1) {
        return true
      } else if (item.children) {
        // 4. 如果有item的子节点的权限, 当前item就得存在
        const cItem = item.children.find(cItem => user.role.menus.indexOf(cItem.key) !== -1)
        if (cItem) {
          return true
        }
      }
  
      return false

    }
    getMenuNode = (menuList) => {
        const path = this.props.location.pathname

        return menuList.map(item => {
            if (this.isAuth(item)) {
                //只有当当前用户有此<Item></Item>对应的权限 时  才生成对应的菜单
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