import React from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Icon, Input, Button} from 'antd';
const Item = Form.Item
export default class Login extends React.Component {
    handleSubmit =(event)=>{
        // alert('嘤嘤嘤')
        event.preventDefault()
    }
    render() {
      
        return (
            <div className='login'>
                <header className='header-login'>
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className='section-login'>
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            />
                        </Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>            
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                                    登 录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}