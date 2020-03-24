import React, { Component } from 'react';
import { Icon, message, Upload } from 'antd'
import './index.css'
import { baseURL } from '../../../request'
import { BraftEditorConfig } from '../../../utils/utils'
import BraftEditor from 'braft-editor'
import axios from 'axios'

const { createElement } = React

class UploadImg extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.send = function () {}
  }

  componentDidMount () {
    // console.log('Editor porps:', this.props)
    const tokenItem = document.cookie.split(';').find(item => ~item.indexOf('token'))
    const token = tokenItem && tokenItem.slice(tokenItem.indexOf('=') + 1)
    const instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Authorization': token,
        'Content-Type': `multipart/form-data`
      },
      withCredentials: false
    })
    this.send = instance
  }

  uploadFn = ({file, success}) => {
    let formData = new FormData()
    formData.append('photo', file)
    this.send.post('photos', formData)
    .then(data => {
      console.log('data', data)
      success({
        url: data.data.url,
        meta: {
          id: data.data.id,
          title: '',
          description: '',
          alt: ''
        }
      })
    })
  }

  handleEditorChange = (newState) => {
    this.props.handleEditorChange && this.props.handleEditorChange(newState)
  }

  render() {
    const {
      bindUploadProps = {},
      value
    } = this.props
    const autoParams = {
      media: {
        uploadFn: this.uploadFn,
        ...BraftEditorConfig.media
      },
      placeholder: '',
      contentStyle: {height: 600},
      controls: BraftEditorConfig.controls,
      value,
      language: (languages) => languages.en,
      onChange: this.handleEditorChange
    }
    return (
      createElement(
        BraftEditor,
        Object.assign({}, autoParams, bindUploadProps))
    );
  }
}

export default UploadImg;
