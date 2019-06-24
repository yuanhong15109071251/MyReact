/* 商品管理初始显示组件 */
import React, { Component } from 'react'
import { Card, Table, Button, Icon, Select, Input, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqProductsSearch, reqUpdateCommodityStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'


const { Option } = Select
export default class ProductHome extends Component {

    state = {
        loading: false, // 是否正在获取数据中
        products: [],//当前页的商品数组
        total: 0,//记录商品的总个数
        seacrhType: 'productName',//根据  productName 商品名称   productDesc 商品描述    来搜索
        searchName: '',//根据搜索关键字来 
    }

    /* 初始化所有列信息 */
    initColumns = () => {
        this.columns = [
            {
                title: "商品名称",
                dataIndex: "name"
            },
            {
                title: "商品描述",
                dataIndex: "desc"
            },
            {
                title: "价格",
                dataIndex: "price",
                render: (price) => '￥' + price
            },
            {
                width: 100,
                title: "状态",
                // dataIndex: "status",
                render: (product) => {
                    const { status, _id }=product
                    const btntext = status === 1 ? '下架' : '上架'
                    const text = status === 1 ? '在售' : '已下架'
                    return (
                        <span>
                            <Button type="primary" onClick={() => this.UpdateCommodityStatus(status === 1 ? 2 : 1, _id)}>{btntext}</Button>
                            <span>{text}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: "操作",
                render: (product) => (
                    <span>
                        <LinkButton onClick={()=>this.props.history.push('/product/detail',product)}>详情</LinkButton>
                        <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                    </span>
                )
            },
        ]

    }
    /* 指定页码 和当前页码的商品列表数据 */
    getProducts = async (pageNum) => {
        //存储当前页
        this.pageNum = pageNum
        const { searchName, seacrhType } = this.state
        let result
        this.setState({ loading: true })
        if (!searchName) {
            //一般的分页请求 searchName 没有值
            result = await reqProducts({ pageNum, pageSize: PAGE_SIZE })
        } else {
            //搜索的请求
            result = await reqProductsSearch({ pageNum, pageSize: PAGE_SIZE, searchName, seacrhType })
        }

        // console.log(pageNum)
        this.setState({ loading: false })
        if (result.status ===0) {
            const { total, list } = result.data
            //更新状态
            this.setState({
                total: total,
                products: list,//获取商品信息
            })

        }

    }
    /* 更新商品状态 */
    UpdateCommodityStatus = async (status,productId) => {
        const result = await reqUpdateCommodityStatus(productId, status)
        if (result.status === 0) {
            //更新成功  显示当前页
            message.success('更新成功')
            //重新获取当前页显示
            this.getProducts(this.pageNum)
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        const { loading, total, products, searchName, seacrhType } = this.state
        // console.log(total,products)
        // card的左侧
        const title = (
            <span>
                <Select value={seacrhType} style={{ width: 150 }} onChange={(value) => this.setState({ searchType: value })}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select> &nbsp;&nbsp;
                <Input placeholder="关键字" style={{ width: 150 }} value={searchName} onChange={(event) => this.setState({ searchName: event.target.value })}></Input>&nbsp;&nbsp;
                <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        // Card的右侧onClick={() => { this.setState({ showStatus: 1}) }}
        const extra = (
        <Button type='primary'   onClick={() => this.props.history.push('/product/addupdate')}>  
                <Icon type='plus'/>
                添加商品
        </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    //onChange:(pageNum)=>{this.getProducts(pageNum)}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true, total, onChange: this.getProducts }}
                />
            </Card>
        )
    }
}
