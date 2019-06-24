import React, { PureComponent } from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'
import PicturesWall from './pictureswall '
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdate } from '../../api'






const { Item } = Form
const { TextArea } = Input

/*
Product的添加和更新的子路由组件
 */
class ProductAddUpdate extends PureComponent {
    constructor(props) {
        super(props);
        this.pwRef = React.createRef();
        this.editorRef = React.createRef();
    }


    state = {
        options: []

    }
    //验证价格的
    validatePrice = (rule, value, callback) => {
        console.log(value, typeof value)
        if (value < 0) {
            callback('价格必须大于0') // 验证没通过

        } else {
            callback() // 验证通过
        }
    }
    //提交
    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                //1.收集数据
                const { name, desc, price, categoryIds } = values
                let pCategoryId,categoryId

                if (categoryIds.length === 1) {
                    //一级列表
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    //二级列表
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                //读取所有上传图片文件名的数组
                const imgs = this.pwRef.current.getImgs()
                //读取富文本编辑内容 html格式的字符串
                const detail = this.editorRef.current.getDetail()
                console.log(imgs, detail)

                //获取product对象
                const product = { name, desc, imgs, detail, price, pCategoryId, categoryId }
                //判断是否是更新 是就要添加_id
                if (this.isUpdate) {
                    product._id = this.product._id
                };
                const result = await reqAddOrUpdate(product)
                 //
                if(result.status===0){
                    message.success(  (this.isUpdate?'修改':'添加')+ '成功')
                    this.props.history.goBack()
                }else{
                    message.error(  (this.isUpdate?'修改':'添加')+ '失败')
                }

            }

        })
    }
    //selectedOptions  选择多项 放在数组里
    //选择某个一级时执行  请求获取对应的二级显示
    loadData = async selectedOptions => {
        console.log('loadData()', selectedOptions)
        //得到一级
        const targetOption = selectedOptions[0]  //targetOption 结构 对象{value,label,isLeaf}
        targetOption.loading = true;//显示那个小箭头 点击那个兼有  会有那个刷新的小圈出现 正在加载
        //异步获取二级分类列表 
        //传一个父分类ID
        const pCategoryId = targetOption.value
        const subCategorys = await this.getCategorys(pCategoryId)
        targetOption.loading = false; //把那个刷新的小圈隐藏起来
        //需要的到子分类的数组才生成子options
        if (!subCategorys || subCategorys.length === 0) {
            //一级分类下 没有二级分类列表
            targetOption.isLeaf = true   //向右的箭头没了
        } else {
            //一级分类下 有二级分类列表

            //根据获得的subCategorys进行map方法

            //给option添加children 来确定二级列表
            targetOption.children = subCategorys.map((c) => ({
                label: c.name,
                value: c._id,
                isLeaf: true
            }))
        }
        //更新options列表数据
        this.setState({
            options: [...this.state.options],
        });
        // 异步去加载

    };

    //根据分类的数组更新 options显示
    initOptions = async (categorys) => {
        //要产生一个options 并且跟新他的状态
        //option 结构  {value，label，isLeaf}  每个value都对应一个parentId（一级父类）
        const options = categorys.map(c => ({
            label: c.name,
            value: c._id,
            isLeaf: false
        }))
        //如果当前是更新二级分类的商品 需要获取对应的二级分类列表显示
        const { product, isUpdate } = this
        if (isUpdate && product.pCategoryId !== '0') {
            const subCategorys = await this.getCategorys(product.pCategoryId)
            if (subCategorys && subCategorys.length > 0) {
                //options中找到对应的option
                const targetOption = options.find(option => option.value === product.pCategoryId)
                targetOption.children = subCategorys.map((c) => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true
                }))
            }
        }
        this.setState({ options })
    }

    //获取一级或者二级分类列表显示
    getCategorys = async (parentId) => {

        const result = await reqCategorys(parentId)
        console.log(result)
        if (result.status === 0) {

            //分类的列表  可能是一级或者二级
            const categorys = result.data
            if (parentId === '0') {
                //获取的是一级列表
                this.initOptions(categorys)
            } else {
                //获取的是二级列表
                return categorys   //返回值作为async函数返回promise对象的成功的value  
            }
        }
    }

    componentWillMount() {

        //保存商品对象  可能为空添加的时候  
        this.product = this.props.location.state || {}
        this.isUpdate = !!this.product._id
    }
    componentDidMount() {
        //获取一级列表
        this.getCategorys('0')
    }
    render() {
        //读取 product
        const { product, isUpdate } = this


        if (product._id) {
            //修改
            if (product.pCategoryId === 0) {
                //说明在一级分类里边
                product.categoryIds = [product.categoryId]
            } else {
                product.categoryIds = [product.pCategoryId, product.categoryId]

            }
        } else {
            //添加
            product.categoryIds = []
        }
        const formItemLayout = {
            labelCol: { span: 2 },  // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        }

        // 头部左侧标题
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{ fontSize: 20 }} />
                </LinkButton>
                {isUpdate ? '更新商品' : '添加商品'}
                <span></span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (

            <Card title={title}>
                <Form  {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: '必须输入商品名称' }
                                ]
                            })(<Input placeholder='请输入商品名称' />)
                        }

                    </Item>
                    <Item label="商品描述">

                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    { required: true, message: '必须输入商品描述' }
                                ]
                            })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
                        }

                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '必须输入商品价格' },
                                    { validator: this.validatePrice }
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元' />)
                        }

                    </Item>
                    <Item label="商品分类">

                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: product.categoryIds,
                                rules: [
                                    { required: true, message: '必须指定商品分类' },
                                ]
                            })(

                                <Cascader
                                    placeholder='请指定商品分类'
                                    options={this.state.options}  /*需要显示的列表数据数组*/
                                    loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                                />,
                            )
                        }

                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pwRef} imgs={product.imgs} />
                    </Item>
                    <Item
                        label="商品详情"
                        wrapperCol={{ span: 18 }}
                    >
                        <RichTextEditor ref={this.editorRef} detail={product.detail} />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)
/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性 标签属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: this.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} /> 内部把自己塞进去 ，塞进去以后等于一个标识属性名
3. 通过ref容器读取标签元素: this.pw.current
 */