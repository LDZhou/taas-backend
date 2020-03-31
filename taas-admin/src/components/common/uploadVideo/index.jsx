import React, { Component } from 'react';
import { Icon, message, Upload } from 'antd'
import { baseURL } from '../../../request'

const { createElement } = React

class UploadVideo extends Component {
  state = {
    token: '',
    loading: false
  }

  componentDidMount () {
    // console.log('UploadVideo porps:', this.props)
    const tokenItem = document.cookie.split(';').find(item => ~item.indexOf('token'))
    const token = tokenItem && tokenItem.slice(tokenItem.indexOf('=') + 1)
    this.setState({ token })
  }

  handleUploadChange = ({fileList, file}) => {
    if (file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (file.status === 'done') {
      const result = fileList[fileList.length - 1].response
      this.setState({ loading: false })
      if (result) {
        this.props.setFieldsValue && this.props.setFieldsValue(result)
      }
    }
  }

  beforeUpload = (file) => {
    console.log('beforeUpload', file)
    const formats =  ['video/mp4', 'video/ogg']
    if (!formats.includes(file.type)) {
      message.error('Video format error (support mp4 ogg)!')
      return false
    }
    // const isLt1M = file.size / 1024 / 1024 < 5;
    // if (!isLt1M) {
    //   message.error('Image must smaller than 5MB!')
    //   return false
    // }
    return true
  }

  handleDelete = (event) => {
    event.stopPropagation()
    // this.props.handleDelete && this.props.handleDelete()
    this.props.setFieldsValue && this.props.setFieldsValue('')
  }

  render() {
    const { token, loading } = this.state
    const {
      bindUploadProps = {},
      value
    } = this.props
    const autoParams = {
      name: 'photo',
      action: baseURL + 'photos',
      headers: {
        Authorization: token
      },
      data: {
        photo_type: 'video'
      },
      listType: 'picture-card',
      style: {},
      showUploadList: false,
      onChange: this.handleUploadChange,
      beforeUpload: this.beforeUpload
    }

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    const autoImage = (
      <div style={{position: 'relative'}}>
        <Icon
          type="close"
          style={{position: 'absolute', right: 0, padding: 3, color: '#c9c9c9', background: 'rgba(0, 0, 0, 0.3)', zIndex: 1000}}
          onClick={this.handleDelete}/>
        {value && <video src={value.url} controls className='cover-photo'/>}
      </div>
    )
    return (
      createElement(
        Upload,
        Object.assign({}, autoParams, bindUploadProps),
        value ? autoImage : uploadButton)
    );
  }
}

export default UploadVideo;
