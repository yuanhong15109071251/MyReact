/* 用于添加分类名称的form组件 */
import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'
const { Option } = Select;
const { Item } = Form
class Addupdateform extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
    }

    componentWillMount() {
        // 将form交给父组件(Category)保存
        this.props.setForm(this.props.form)
    }
    render() {
        const { parentId, categorys } = this.props

        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId,
                            rules: [{ required: true, message: '分类名称必须指定' }]
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map((citem,index) => <Option key={index} value={citem._id}>{citem.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {getFieldDecorator('categoryName', {

                        initialValue: '',
                        rules: [{ required: true, message: '分类名称必须指定' }]
                    })(<Input placeholder="请输入名称"></Input>)}

                </Item>

            </Form>
        )
    }
}

export default Form.create()(Addupdateform)