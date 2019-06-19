/* 用于更新分类名称的form组件 */
import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired,
    }

    componentWillMount() {
        // 将form交给父组件(Category)保存
        this.props.setForm(this.props.form)
    }
    render() {
        const {categoryName} =this.props
        // console.log(categoryName)
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Form>
              
                    <Form.Item>   

                        {getFieldDecorator('categoryName', {

                            initialValue:categoryName,
                            rules: [{ required: true, message: '分类名称必须指定' }]
                        })(<Input placeholder="请输入名称"></Input>)}

                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Form.create()(UpdateForm)