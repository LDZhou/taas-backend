import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, Select } from 'antd';
import UploadImg from '../../common/uploadImg/index'
import { BrandType } from '../../../utils/utils'
import WrapPhotos from '../../common/wrapPhotos/index'

const { createElement } = React
const { Item } = Form
const { Option } = Select

function Application(props) {
  let brandId = props.match.params.id
  useEffect(() => {
    if (brandId) {
      getBrandDetail()
    }
  }, [])

  const [brandDetail, useBrandDetail] = useState({})

  function getBrandDetail () {
    window.send.get(`brands/${brandId}`).then(data => {
      useBrandDetail(data.data)
      useLoading(false)
    })
    .catch(err => {
      useLoading(false)
    })
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
        if (brandDetail.id) {
          window.send.put(`brands/${brandDetail.id}`, {brand: params})
          .then(data => {
            message.success('品牌修改成功！')
            useBrandDetail(data.data)
            useLoading(false)
          })
        } else {
          window.send.post(`brands`, {brand: params})
          .then(data => {
            message.success('品牌创建成功！')
            useBrandDetail(data.data)
            useLoading(false)
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
      message.success('品牌删除成功！')
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
      label: '名称'
    },
    brand_type: {
      label: '类别',
      tag: Select,
      props: {
        placeholder: '请选择类别',
        className: 'select-brand_type',
        getPopupContainer: () => document.getElementsByClassName('select-brand_type')[0]
      },
      children: Object.entries(BrandType).map(item => <Option value={item[0]} key={item[0]}>{item[1]}</Option>)
    },
    address: {
      label: '公司地址'
    },
    contact_name: {
      label: '联系⼈姓名'
    },
    contact_title: {
      label: '联系⼈职位'
    },
    contact_phone: {
      label: '联系⼈电话',
      props: {
        type: 'number'
      }
    },
    contact_email: {
      label: '联系⼈邮箱'
    },
    license_photo_id: {
      label: '营业执照',
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
        return BrandType[brandDetail.brand_type] || '-'
      case 'license_photo_id':
        return brandDetail.business_license ? <img src={brandDetail.business_license.url} className='cover-photo'/> : '-'
      default :
        return brandDetail[key] || '-'
    }
  }

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">品牌详情</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>编辑</Button>
        {brandDetail.id && <Popconfirm
          title="确定删除品牌？"
          onConfirm={confirmDeleteBrand}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" style={{marginLeft: 20}}>删除</Button>
        </Popconfirm>}
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label='ID'>
            <div>{brandDetail.id || '-'}</div>
          </Item>
          {Object.keys(renderDetailForm).map(key => {
            return <Item label={renderDetailForm[key].label || ''} key={key}>
              {getFieldDecorator(key, {
                rules:  renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}不能为空!` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (brandDetail[key] || undefined)
              })(
                isEdit ? createElement(
                  renderDetailForm[key].tag || Input,
                  Object.assign({},
                    {placeholder: `请输入${renderDetailForm[key].label}`},
                    renderDetailForm[key].props),
                    renderDetailForm[key].children
                  ) : <div>{renderDetail(key)}</div>
              )}
            </Item>
          })}
          <Item label="相关资质">
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
          <Item label='注册时间'>
            <div>{brandDetail.created_at || '-'}</div>
          </Item>
          {isEdit && <Row style={{marginTop: 20}}>
            <Col span={22}>
              <Item className='save-button'>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Item>
            </Col>
          </Row>}
        </div>
      </Form>

    </Spin>
  )
}

const WrappedApplicationForm = Form.create()(Application);
export default WrappedApplicationForm
