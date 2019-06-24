import React, { Component } from 'react'

/* 商品详情 */
import { List, Card, Icon, span } from 'antd'
import LinkButton from '../../components/link-button';
import { reqreqUpdateCommodity } from '../.././api'
import { BASE_IMG_URL } from '../../utils/constants'
const { Item } = List
export default class ProductDetail extends Component {

    state = {
        cName1: '',//一级分类的名称
        cName2: '',//二级分类的名称
    }

    async componentDidMount() {
        //获取分类的ID   categoryId：分类ID   pCategoryId：父分类Id
        const { pCategoryId, categoryId } = this.props.location.state
        console.log(pCategoryId, categoryId)
        if (pCategoryId === '0') {
            const result = await reqreqUpdateCommodity(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })//更新名称为一级分类下的名称

        }
        else {
            //     //二级分类下的名称
            const result1 = await reqreqUpdateCommodity(pCategoryId)
            const result2 = await reqreqUpdateCommodity(categoryId)
            const cName1 = result1.data.name//一级
            const cName2 = result2.data.name//二级
            this.setState({ cName1, cName2 })
        }

    }

    render() {
        const { name, desc, price, detail, imgs } = this.props.location.state
        const { cName1, cName2 } = this.state
        const title = [
            <span>
                <LinkButton >
                    <Icon key={Icon} onClick={() => this.props.history.goBack()} type='arrow-left' style={{ color: "red" }} />
                </LinkButton>
                <span>商品详情</span>
            </span>
        ]
        return (
            <Card title={title} className='product-detail' key={Card}>
                <List>
                    <Item>
                        <span className='product-detail-left'>商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='product-detail-left'>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='product-detail-left'>商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className='product-detail-left'> 所属分类：</span>
                        <span>{cName1} --> {cName2}</span>
                    </Item>
                    <Item>
                        <span className='product-detail-left'>商品图片：</span>
                        <span>
                            {
                                imgs.map(img => <img src={BASE_IMG_URL + img} alt="img" key={img} style={{ width: 150, height: 150 }}></img>)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='product-detail-left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
