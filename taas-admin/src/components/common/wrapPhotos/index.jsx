import React, { Component } from 'react';
import UploadImg from '../uploadImg/index'
import './index.css'
const { createElement } = React

class WrapPhotos extends Component {
  state = {
  }

  // componentDidMount () {
  //   console.log('this.props', this.props)
  // }

  updateValue (newPhotos) {
    this.props.setFieldsValue && this.props.setFieldsValue(newPhotos)
  }

  render() {
    const { value, isEdit, maxCount = 9 } = this.props
    const self = this
    return (
      <div className="photos-wrap-c">
        {value && value.map((photoItem, ind) => {
          return isEdit ? <UploadImg
            key={photoItem.id}
            value={photoItem}
            bindUploadProps={{}}
            setFieldsValue={(result) => {
              let copyPhotos = value.slice()
              if (!result) {
                copyPhotos.splice(ind, 1)
              } else {
                copyPhotos[ind] = result
              }
              self.updateValue(copyPhotos)
            }}/> : <div key={photoItem.id}>
            {photoItem && <img src={photoItem.url}/>}
          </div>
        })}
        {(!value || value.length < maxCount) && isEdit && <UploadImg
          value={null}
          bindUploadProps={{}}
          setFieldsValue={(result) => {
            let copyPhotos = value ? value.slice() : []
            copyPhotos.push(result)
            self.updateValue(copyPhotos)
          }}/>}
      </div>
    );
  }
}

export default WrapPhotos;
