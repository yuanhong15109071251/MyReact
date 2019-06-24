import React, { Component } from 'react'
/* 用户管理 */
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../components/link-button'
import { formateDate } from '../../utils/dateUtils'
import UserForm from './user-form'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqAddOrUpdateUser,reqDeleteUser } from '../../api'
export default class Users extends Component {
  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框

  }
   //初始数据
   initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },

      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        //根据角色id查找对应的角色名
        // render: (role_id) => this.roleNames[role_id]
        // render: (role_id) => this.state.roles.find(role => role._id===role_id).name // 每显示一个都需要遍历
        render: (role_id) => this.rolesObj[role_id].name // 不需要遍历
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },

    ]
  }
//生成的新的保存
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames
  }
  //获取用户列表
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      this.initRoleNames(roles)
      //拿着roles生成一个对象 对象里面的每一个属性的属性名role_id 值 作为属性名
      // 得到一个包含所有role对象的容器对象, 并保存
      this.rolesObj = roles.reduce((pre, role) => {
        // 添加一个属性
        pre[role._id] = role
        return pre
      }, {})    // {role._id值: roleName}

      this.setState({
        users,
        roles
      })

      this.setState({ users, roles })
    }
  }
  //显示添加用户的界面 
  showAddUser = () => {
    this.user = null
    this.setState({
      isShow: true
    })
  }
  //修改时获取数据的方法
  showUpdate = (user) => {
    //先要保存user
    this.user = user
    this.setState({ isShow: true })
  }
  //添加或者修改 保存
  addOrUpdateUser = async () => {
    this.form.validateFields(async (error, user) => {
      if (!error) {

        this.form.resetFields()
        if (this.user) {
          user._id = this.user._id
        }
        this.setState({
          isShow: false
        })

        const result = await reqAddOrUpdateUser(user)
        if (result.status === 0) {
          this.getUsers()
        }
        message.success('保存用户成功')
      }else{
        message.error('保存用户失败')
      }
      
    })
  }


  //删除
  deleteUser = (user) => {
    Modal.confirm({
      content: `确定删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          this.getUsers()
          message.success('删除成功')
        }
      }
    })
   
  }
 
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }
   
  
  render() {
    const { users, roles, isShow } = this.state
    const user = this.user || {}
    const title = (
      <span>
        <Button type="primary" onClick={this.showAddUser}>创建用户</Button>&nbsp;
            </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({ isShow: false })
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    )
  }
}
