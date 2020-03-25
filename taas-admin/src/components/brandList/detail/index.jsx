import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, DatePicker, Select } from 'antd';
import UploadImg from '../../common/uploadImg/index'
import moment from 'moment'
import { BrandType } from '../../../utils/utils'
import WrapPhotos from '../../common/wrapPhotos/index'

const { createElement } = React
const { Item } = Form
const { Option } = Select

function Application(props) {
  let brandId = props.match.params.id
  useEffect(() => {
    // if (brandId) {
    //   activeDetailInit()
    // } else {
    //   optionsInit()
    // }
  }, [])

  const [brandDetail, useBrandDetail] = useState({})

  // const [allproducts, useAllproducts] = useState([])

  // const [allStores, useAllStores] = useState([])

  // function getActiveDetail () {
  //   return window.send.get(`events/${brandId}`)
  // }

  // function getAllproducts () {
  //   return window.send.get('products', {
  //     params: {
  //       page: 0
  //     }
  //   })
  // }

  // function getAllStores () {
  //   return window.send.get('stores', {
  //     params: {
  //       page: 0
  //     }
  //   })
  // }

  // function activeDetailInit() {
  //   Promise.all([getActiveDetail(), getAllproducts(), getAllStores()])
  //   .then(vals => {
  //     useBrandDetail(vals[0].data)
  //     useAllproducts(vals[1].data)
  //     useAllStores(vals[2].data)
  //     useLoading(false)
  //   })
  //   .catch(err => {
  //     useLoading(false)
  //   })
  // }
  // function optionsInit() {
  //   Promise.all([getAllproducts(), getAllStores()])
  //   .then(vals => {
  //     useAllproducts(vals[0].data)
  //     useAllStores(vals[1].data)
  //     useLoading(false)
  //   })
  //   .catch(err => {
  //     useLoading(false)
  //   })
  // }

  const [loading, useLoading] = useState(() => Boolean(brandId))

  const [isEdit, useIsEdit] = useState(() => !Boolean(brandId))

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        useLoading(true)
        let params = Object.assign({}, values)
        if (params.cover_photo_id) {
          params.cover_photo_id = params.cover_photo_id.id
        }
        params.manufactured_at = moment(params.manufactured_at).format('YYYY-MM-DD HH:mm')
        params.send_date = moment(params.send_date).format('YYYY-MM-DD HH:mm')
        params.delivery_date = moment(params.delivery_date).format('YYYY-MM-DD HH:mm')
        console.log('val =>', params)
        // if (brandDetail.id) {
        //   window.send.put(`events/${brandDetail.id}`, {event: params})
        //   .then(data => {
        //     message.success('产品修改成功！')
        //     useBrandDetail(data.data)
        //     useLoading(false)
        //   })
        // } else {
        //   window.send.post(`events`, {event: params})
        //   .then(data => {
        //     message.success('产品创建成功！')
        //     useBrandDetail(data.data)
        //     useLoading(false)
        //   })
        //   .catch(err => {
        //     useLoading(false)
        //   })
        // }
      }
    });
  };

  const confirmDeleteBrand = () => {
    // useLoading(true)
    // window.send.delete(`events/${brandDetail.id}`)
    // .then(data => {
    //   message.success('品牌删除成功！')
    //   useLoading(false)
    //   props.history.goBack()
    // })
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
    business_license: {
      label: '营业执照',
      tag: UploadImg,
      initValue: brandDetail.business_license,
      props: {
        bindUploadProps: {},
        setFieldsValue: (result) => {
          setFieldsValue({business_license: result})
        }
      },
      rules: []
    },
    certificates: {
      label: '相关资质',
      tag: WrapPhotos,
      initValue: brandDetail.certificates,
      props: {
        isEdit: isEdit,
        maxCount: 5,
        setFieldsValue: (result) => {
          setFieldsValue({certificates: result})
        }
      },
      rules: []
    },
  }

  const renderDetail = (key) => {
    switch (key) {
      case 'product_manual':
        return brandDetail.card_photo ? <img src={brandDetail.card_photo.url} className='cover-photo'/> : '-'
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
