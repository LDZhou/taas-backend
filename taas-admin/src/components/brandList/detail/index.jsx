import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, Select } from 'antd';
import UploadImg from '../../common/uploadImg/index'
import { BrandType, EnBrandType } from '../../../utils/utils'
import WrapPhotos from '../../common/wrapPhotos/index'
import { connect } from 'react-redux'

const { createElement } = React
const { Item } = Form
const { Option } = Select

function Application(props) {
  let brandId = props.match.params.id
  const { explain, lang } = props
  useEffect(() => {
    if (brandId) {
      detailInit()
    } else {
      getApplications().then(data => {
        useApplications(data.data)
        useLoading(false)
      })
      .catch(err => {
        useLoading(false)
      })
    }
  }, [])

  const [brandDetail, useBrandDetail] = useState({})

  const [applications, useApplications] = useState([])

  function detailInit () {
    Promise.all([getBrandDetail(), getApplications()]).then(vals => {
      useBrandDetail(vals[0].data)
      useApplications(vals[1].data)
      useLoading(false)
    })
    .catch(err => {
      useLoading(false)
    })
  }

  function getBrandDetail () {
    return window.send.get(`brands/${brandId}`)
  }

  function getApplications () {
    return window.send.get(`applications`)
  }

  const [loading, useLoading] = useState(() => Boolean(brandId))

  const [isEdit, useIsEdit] = useState(() => !Boolean(brandId))

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        useLoading(true)
        let params = Object.assign({}, values)
        if (params.license_photo_id) {
          params.license_photo_id = params.license_photo_id.id
        }
        if (params.certificate_photo_ids) {
          params.certificate_photo_ids = params.certificate_photo_ids.map(item => item.id)
        }
        params.user_id && (params.user_id = Number(params.user_id))
        if (brandDetail.id) {
          window.send.put(`brands/${brandDetail.id}`, {brand: params})
          .then(data => {
            message.success(`${explain['Brand']}${explain[' modified successfully!']}`)
            useBrandDetail(data.data)
            useLoading(false)
            useIsEdit(false)
          })
          .catch(err => {
            useLoading(false)
          })
        } else {
          window.send.post(`brands`, {brand: params})
          .then(data => {
            message.success(`${explain['Brand']}${explain[' created successfully!']}`)
            useBrandDetail(data.data)
            useLoading(false)
            useIsEdit(false)
          })
          .catch(err => {
            useLoading(false)
          })
        }
      }
    });
  };

  const confirmDeleteBrand = () => {
    useLoading(true)
    window.send.delete(`brands/${brandDetail.id}`)
    .then(data => {
      message.success(`${explain['Brand']}${explain[' deleted successfully!']}`)
      useLoading(false)
      props.history.goBack()
    })
  }

  const { getFieldDecorator, setFieldsValue } = props.form
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    }
  }
  const renderDetailForm = {
    name: {
      label: lang === 'zh_CN' ? '名称' : 'Name'
    },
    app_id: {
      label: explain['App Name'],
      tag: Select,
      props: {
        placeholder: `${explain['Please select the ']}${explain['App Name']}`,
        className: 'select-app_id',
        getPopupContainer: () => document.getElementsByClassName('select-app_id')[0]
      },
      children: applications.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
    },
    brand_type: {
      label: explain['Type'],
      tag: Select,
      props: {
        placeholder: `${explain['Please select the ']}${explain['Type']}`,
        className: 'select-brand_type',
        getPopupContainer: () => document.getElementsByClassName('select-brand_type')[0]
      },
      children: Object.entries(lang === 'zh_CN' ? BrandType : EnBrandType).map(item => <Option value={item[0]} key={item[0]}>{item[1]}</Option>)
    },
    address: {
      label: explain['Address'],
    },
    contact_name: {
      label: explain['Rep. Name'],
    },
    contact_title: {
      label: explain['Rep. Position'],
    },
    contact_phone: {
      label: explain['Rep. Mobile No'],
      props: {
        type: 'number'
      },
      rules: [
        { max: 11, message: lang === 'zh_CN' ? '联系⼈电话长度不超过11位！' : 'The length of the phone number must not exceed 11 digits!' },
        { required: true, message: `${explain['Rep. Mobile No']}${explain[' cannot be empty!']}` },
      ]
    },
    contact_email: {
      label: explain['Rep. Email'],
    },
    province: {
      label: explain['Province'],
      rules: []
    },
    city: {
      label: explain['City'],
      rules: []
    },
    user_id: {
      label: explain['Rep. User ID'],
      props: {
        type: 'number'
      },
      rules: []
    },
    license_photo_id: {
      label: explain['Business License'],
      tag: UploadImg,
      initValue: brandDetail.business_license,
      props: {
        bindUploadProps: {},
        setFieldsValue: (result) => {
          setFieldsValue({license_photo_id: result})
        }
      },
      rules: []
    }
  }

  const renderDetail = (key) => {
    switch (key) {
      case 'brand_type':
        return (lang === 'zh_CN' ? BrandType[brandDetail.brand_type] : EnBrandType[brandDetail.brand_type]) || '-'
      case 'license_photo_id':
        return brandDetail.business_license ? <img src={brandDetail.business_license.url} className='cover-photo'/> : '-'
      default :
        return brandDetail[key] || '-'
    }
  }

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">{explain['Brand Details']}</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>{explain['Edit']}</Button>
        {brandDetail.id && <Popconfirm
          title={explain['Sure to delete?']}
          onConfirm={confirmDeleteBrand}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" style={{marginLeft: 20}}>{explain['Delete']}</Button>
        </Popconfirm>}
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label='ID'>
            <div>{brandDetail.id || '-'}</div>
          </Item>
          <Item label='App ID'>
            <div>{brandDetail.app_id || '-'}</div>
          </Item>
          {Object.keys(renderDetailForm).map(key => {
            return <Item label={renderDetailForm[key].label || ''} key={key}>
              {getFieldDecorator(key, {
                rules:  renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}${explain[' cannot be empty!']}` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (brandDetail[key] || undefined)
              })(
                isEdit ? createElement(
                  renderDetailForm[key].tag || Input,
                  Object.assign({},
                    {placeholder: `${explain['Please enter the ']}${renderDetailForm[key].label}`},
                    renderDetailForm[key].props),
                    renderDetailForm[key].children
                  ) : <div>{renderDetail(key)}</div>
              )}
            </Item>
          })}
          <Item label={explain['Relevant Certifications']}>
            {getFieldDecorator('certificate_photo_ids', {
              initialValue: brandDetail.certificates || []
            })(
              <WrapPhotos
                isEdit={isEdit}
                maxCount={5}
                setFieldsValue={(result) => {
                  setFieldsValue({certificate_photo_ids: result})
                }}/>
            )}
          </Item>
          <Item label={explain['Registration Time']}>
            <div>{brandDetail.created_at || '-'}</div>
          </Item>
          {isEdit && <Row style={{marginTop: 20}}>
            <Col span={22}>
              <Item className='save-button'>
                <Button type="primary" htmlType="submit">
                  {explain['Save']}
                </Button>
              </Item>
            </Col>
          </Row>}
        </div>
      </Form>

    </Spin>
  )
}

function mapStateToProps(state) {
  return {
    lang: state.LangReducer.lang,
    explain: state.ExplainReducer.explain,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Application))
