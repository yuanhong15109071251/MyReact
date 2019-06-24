import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import { reqRoles, reqAddRole, reqRolesUpdate } from '../../api'
import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { PAGE_SIZE } from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'
export default class Role extends Component {
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面

    }
    constructor(props) {
        super(props)
        this.authRef = React.createRef()
    }
    //获取角色列表
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }

    }
    //添加角色
    addRole = () => {
        // 进行表单验证, 只能通过了才向下处理
        this.form.validateFields(async (error, values) => {
            if (!error) {

                this.setState({
                    isShowAdd: false
                })
                // 清除上一次输入的数据
                this.form.resetFields()
                // 请求添加role
                const result = await reqAddRole(values.roleName)
                // 成功后, 更新显示角色列表
                if (result.status === 0) {
                    message.success('添加角色成功')
                    const role = result.data 
                    const roles = this.state.roles
                    this.setState({
                        //生成一个新的数组
                        roles: [...roles, role]
                    })
                }
            }else{
                message.error('添加角色失败')
            }
        })
    }
    //设置权限
    updateRole = async () => {
 console.log('授权')
        this.setState({
            isShowAuth: false
        })
        // 更新user对象的属性
        const role = this.role
        role.menus = this.authRef.current.getMenus()
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        // 发请求更新用户
        const result = await reqRolesUpdate(role)
        if (result.status === 0) {
            message.success('授权成功')
            this.getRoles()
        }

    }
    //初始数据
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
            {
                title: '操作',
                render: (role) => <LinkButton onClick={() => this.showAuth(role)}>设置权限</LinkButton>
            },
        ]
    }

    //显示权限设置界面
    showAuth = (role) => {
        this.role = role
        this.setState({
            isShowAuth: true
        })
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, isShowAdd, isShowAuth } = this.state
        const role = this.role || {}

        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>&nbsp;
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}
                >
                    <AuthForm ref={this.authRef} role={role} />
                </Modal>
            </Card>
        )
    }
}