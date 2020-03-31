import React, { Component } from 'react';
import { Icon, message, Upload } from 'antd'
import { baseURL } from '../../../request'
import './index.css'
import { LinkOutlined, DeleteOutlined } from '@ant-design/icons'

const { createElement } = React

class UploadImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    this.token = ''
  }

  componentDidMount () {
    // console.log('UploadImg porps:', this.props)
    const tokenItem = document.cookie.split(';').find(item => ~item.indexOf('token'))
    this.token = tokenItem && tokenItem.slice(tokenItem.indexOf('=') + 1)
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
    // console.log('beforeUpload', file)
    const formats =  ['application/pdf', 'image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/bmp', 'image/jpeg']
    if (!formats.includes(file.type)) {
      message.error('File format error (support pdf png jpg gif svg bmp jpeg)!')
      return false
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must smaller than 5MB!')
      return false
    }
    return true
  }

  handleDelete = (event) => {
    event.stopPropagation()
    this.props.setFieldsValue && this.props.setFieldsValue('')
  }

  render() {
    const self = this
    const { loading } = this.state
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
        Authorization: this.token
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

    const isPDF = () => {
      if (value && value.url) {
        const fileType = value.url.slice(value.url.lastIndexOf(".") + 1).toLowerCase()
        return fileType === 'pdf'
      } else {
        return false
      }
    }

    const renderPDF = () => {
      const fileName = value.url.slice(value.url.lastIndexOf("/") + 1)
      return (
        <div className="pdf-file-container">
          <LinkOutlined />
          <span onClick={() => window.open(value.url)}>{fileName}</span>
          <DeleteOutlined onClick={(e) => { self.handleDelete(e) }}/>
        </div>
      )
    }

    return (
      createElement(
        isPDF() ? renderPDF : Upload,
        Object.assign({}, autoParams, bindUploadProps),
        value ? autoImage : uploadButton)
    );
  }
}

export default UploadImg;
