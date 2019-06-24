import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTyoes from 'prop-types'
export default class RichTextEditor extends Component {
  static propTyoes = {
    detail: PropTyoes.string//不是必须有 添加/修改
  }


  constructor (props) {
    super(props);
    const {detail} = this.props
    if(detail){
      //如果有值，创建一个带此数据的editorState
      const contentBlocks = htmlToDraft(detail)
      const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks);
      const editorState =EditorState.createWithContent(contentState)
      this.state= {
        editorState
      }
    }else{
      //没有传入已有的detail，创建空的对象
      this.state = {
      editorState: EditorState.createEmpty()}
    }


    
}

  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');//上传图片的地址  
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve({ data: { link: response.data.url } });
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{ border: '1px solid black', height: 200, paddingLeft: 10 }}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}