/* 
右侧 
*/
import React, { Component } from 'react'
import { formateDate } from '../../utils/dateUtils'
import *as stirageUtils from '../../utils/stirageUtils'
import { getWeather } from '../../api'
import MemoryUntils from '../../utils/memoryUtils'
import './index.less'
import { Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import LinkButton from '../../components/link-button'
import menuList from '../../config/menuConfig'

class Header extends Component {
    
    state = {
        sysTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
    }
    /*
      退出登陆
       */
    logout = () => {
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
               //变成箭头函数this就会有路由组件的三个属性
                console.log('OK')
                // 移除保存的user
                stirageUtils.removeUser()
                MemoryUntils.user = {}
                // 跳转到login
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    /*
    根据请求的path得到对应的标题
     */
    getTitle = (path) => {
        let title
        menuList.forEach(menu => {
            if (menu.key === path) {
                title = menu.title
            } else if (menu.children) {
                menu.children.forEach(item => {
                    if (path.indexOf(item.key) === 0) {
                        title = item.title
                    }
                })
            }
        })

        return title
    }


    /* 实时时间 */
    getsysTime = () => {
        //循环定时器
        this.intervalId = setInterval(() => {
            //更新状态
            this.setState({ sysTime: formateDate(Date.now()) })
        }, 1000)

    }
    /*  发异步ajax获取天气数据并更新状态 */
    getweather = async () => {
      
        const {dayPictureUrl, weather } = await getWeather('北京')
        this.setState({dayPictureUrl, weather })
    
    }
    componentDidMount() {
        //获取当前时间
        this.getsysTime()
        //天气
        this.getweather()
    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    render() {
        const { sysTime, dayPictureUrl, weather } = this.state
        // console.log(sysTime, dayPictureUrl, weather )
        // 得到当前用户
        const username = MemoryUntils.user.username


        // 得到当前请求的路径
        const path = this.props.location.pathname
        // 得到对应的标题
        const title = this.getTitle(path)
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    {/* <a href="##" onClick={this.logout}>退出</a> */}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-right">
                        <span className="tittle">{title}</span>
                    </div>
                    <div className="header-bottom-left">
                        <span>{sysTime}</span>
                        <img src={dayPictureUrl} alt="ass" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)