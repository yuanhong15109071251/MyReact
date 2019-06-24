import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImage } from '../../api'
import PropTyoes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants'
function getBase64(file) {
  return new Promise((resolve, reject) => {//异步的读取
    const reader = new FileReader();
    reader.readAsDataURL(file);//读它里面关联的图片
    reader.onload = () => resolve(reader.result);//成功 里面存的是一个图片BASE的数据
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTyoes = {
    imgs: PropTyoes.array//不是必须有 添加/修改
  }
  state = {
    previewVisible: false,//是否显示大图  默认不显示
    previewImage: '',//大图的地址
    fileList: [//所有已上传图片信息对象的数组
      {
        uid: '-1',//图片的位移Id 标识
        name: 'xxx.png',//图片名字
        status: 'done',//已上传完成  uploading done  removed error
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
        response: '{"status": "success"}', // 服务端响应内容
        linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
      },
    ],
  };
  //返回所有已上传文件名的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }
  //关闭大图预览
  handleCancel = () => this.setState({ previewVisible: false });
  //打开大图预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);//给他了打的BASE的值
    }

    this.setState({
      previewImage: file.url || file.preview,//指定大图预览地址
      previewVisible: true,//打开大图预览
    });
  };

  //文件对象的状态发生改变 时 的 回调函数
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      //得到图片的文件名name/url
      const result = file.response
      if (result.status === 0) {
        const name = result.data.name
        const url = result.data.url
        //不能直接关系file，而需要关系fileList中的左后一个file  因为file中的最后一个变了  fileLIst中的最后一个不变
        fileList.name = name
        fileList.url = url
        message.success('上传图片成功')
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      //删除图片
      const result = await reqDeleteImage(file.name)
      if (result.status === 0) {
        //删除成功
        message.err('删除图片失败')
      } else {
        message.success('删除图片成功')
      }
    }
    //更新fileList状态
    this.setState({ fileList });
  }


  componentWillMount() {
    //如果传入了imgs 要更新fileList对应的值
    //先取出imgs
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img,index)=>({
        uid:-index+'',
        name:img,
        url:BASE_IMG_URL+img,//地址+图片文件名
        status:'done'
      }))
      this.setState({fileList})
    }
  }
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"  //上传的地址
          listType="picture-card" //列表的内建样式
          fileList={fileList}//已上传文件的列表
          name="image" //请求参数名为image
          onPreview={this.handlePreview} //预览大图 BASE处理 => 浏览器显示为图片
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

