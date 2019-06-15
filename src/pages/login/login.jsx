import React from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Icon, Input, Button } from 'antd';
const Item = Form.Item
class Login extends React.Component {
    handleSubmit = (event) => {
        // alert('嘤嘤嘤')
        event.preventDefault()
        const { form } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                //读取输入的数据
                const values = this.props.form.getFieldsValue()
                console.log('发送登录的Ajax请求', values)
            } else {
                //表单验证错误
            }
        })
       //清空用户输入
        // this.props.form.resetFields()
    }
    validatorPwd = (rule, value, callback) => {
        value = value.trim()
        if (value ==='') { 
            callback('密码必须输入')
        } else if (value.length < 6 || value.length > 12) {
            callback('密码长度必须是6-12位')
        } else if(!/^[a-zA-Z0-9_]+$/){
            callback('密码必须是英文，数字，下划线组成')
        } else {
            callback()//通过验证
        }
    }
        //收集数据
        // const username = this.props.form.getFieldValue('username')
        // const password = this.props.form.getFieldValue('password')
        // const values = this.props.form.getFieldsValue()
        // console.log(username, password, values)
        // this.props.form.resetFields()
    
    render() {
        const { getFieldDecorator } = this.props.form
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
                            {
                                getFieldDecorator('username', {
                                    initialValue: '',
                                    rules: [{ whitespace:true, required: true, message: '必须输入用户名' },
                                            { min: 5, message: '用户名最小为5个字符' },
                                            { max: 12, message: '用户名最大为12个字符' },
                                            {pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文，数字，下划线组成'}
                                    ],

                                })(<Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />)
                            }
                        </Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    initialValue: '',
                                    rules: [{validator: this.validatorPwd}],
                                })(<Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />)
                            }

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
const Wrapform = Form.create()(Login)
export default Wrapform
