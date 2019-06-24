/* 添加用户修改用户的界面  就是那个对话框 */

import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const Item  = Form
const Option  = Select
 class UserForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
      }
    
      componentWillMount () {
        this.props.setForm(this.props.form)
      }
    render() {
        const { roles, user } = this.props
        const { getFieldDecorator } = this.props.form
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }

        return (
            <Form {...formItemLayout}>
                <Item label='用户名'>
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                        })(
                         <Input placeholder='请输入用户名' />
                        )
                    }&nbsp;&nbsp;
                </Item>

                {
                    user._id ? null : (
                        <Item label='密码'>
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                })(
                                    <Input type='password' placeholder='请输入密码' />
                                )
                            }
                        </Item>
                    )
                }&nbsp;&nbsp;

                <Item label='手机号'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                        })(
                            <Input placeholder='请输入手机号' />
                        )
                    }&nbsp;&nbsp;
                </Item>
                <Item label='邮箱'>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                        })(
                            <Input placeholder='请输入邮箱' />
                        )
                    }&nbsp;&nbsp;
                </Item>

                <Item label='角色'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                        })(
                            <Select>
                                {
                                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }&nbsp;&nbsp;
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)