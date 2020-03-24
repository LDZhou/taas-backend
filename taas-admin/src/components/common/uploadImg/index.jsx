import React, { Component } from 'react';
import { Icon, message, Upload } from 'antd'
import './index.css'
import { baseURL } from '../../../request'

const { createElement } = React

class UploadImg extends Component {
  state = {
    token: '',
    loading: false
  }

  componentDidMount () {
    // console.log('UploadImg porps:', this.props)
    const tokenItem = document.cookie.split(';').find(item => ~item.indexOf('token'))
    const token = tokenItem && tokenItem.slice(tokenItem.indexOf('=') + 1)
    this.setState({ token })
  }

  // componentWillReceiveProps (next) {
  //   console.log('UploadImg next porps:', next)
  // }

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
    const formats =  ['image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/bmp', 'image/jpeg']
    if (!formats.includes(file.type)) {
      message.error('Image format error (support png jpg gif svg bmp jpeg)!')
      return false
    }
    const isLt1M = file.size / 1024 / 1024 < 5;
    if (!isLt1M) {
      message.error('Image must smaller than 5MB!')
      return false
    }
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
      value,
      canDelete = true,
      imgClassName = ''
    } = this.props
    const autoParams = {
      name: 'photo',
      action: baseURL + 'photos',
      headers: {
        Authorization: token
      },
      data: {
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
        {canDelete && <Icon
          type="close"
          style={{position: 'absolute', right: 0, padding: 3, color: '#c9c9c9', background: 'rgba(0, 0, 0, 0.3)', zIndex: 1000}}
          onClick={this.handleDelete}/>}
        {value && <img src={value.url} className={`cover-photo ${imgClassName}`}/>}
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

export default UploadImg;
