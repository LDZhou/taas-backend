import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, DatePicker, Select } from 'antd';
import './index.css'
import UploadImg from '../../common/uploadImg/index'
import moment from 'moment'
import { BrandType } from '../../../utils/utils'
import WrapPhotos from '../../common/wrapPhotos/index'

const { createElement } = React
const { Item } = Form
const { Option } = Select

function Application(props) {
  let productId = props.match.params.id
  useEffect(() => {
    // if (productId) {
    //   activeDetailInit()
    // } else {
    //   optionsInit()
    // }
  }, [])

  const [productDetail, useProductDetail] = useState({})

  // const [allproducts, useAllproducts] = useState([])

  // const [allStores, useAllStores] = useState([])

  // function getActiveDetail () {
  //   return window.send.get(`events/${productId}`)
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
  //     useProductDetail(vals[0].data)
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

  const [loading, useLoading] = useState(() => Boolean(productId))

  const [isEdit, useIsEdit] = useState(() => !Boolean(productId))

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
        // if (productDetail.id) {
        //   window.send.put(`events/${productDetail.id}`, {event: params})
        //   .then(data => {
        //     message.success('产品修改成功！')
        //     useProductDetail(data.data)
        //     useLoading(false)
        //   })
        // } else {
        //   window.send.post(`events`, {event: params})
        //   .then(data => {
        //     message.success('产品创建成功！')
        //     useProductDetail(data.data)
        //     useLoading(false)
        //   })
        //   .catch(err => {
        //     useLoading(false)
        //   })
        // }
      }
    });
  };

  const confirmDeleteRecord = () => {
    useLoading(true)
    window.send.delete(`events/${productDetail.id}`)
    .then(data => {
      message.success('删除活动成功！')
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
    wastage_percent: {
      label: '材料损耗⽐例'
    },
    additive_percent: {
      label: '添加物⽐例'
    },
    product_photos_ids: {
      label: '产品图⽚',
      tag: WrapPhotos,
      initValue: productDetail.product_photos_ids,
      props: {
        isEdit: isEdit,
        maxCount: 5,
        setFieldsValue: (result) => {
          setFieldsValue({product_photos_ids: result})
        }
      },
      rules: []
    },
    model: {
      label: '型号'
    },
    size: {
      label: '尺⼨',
      props: {
        type: 'number'
      }
    },
    weight: {
      label: '克重',
      props: {
        type: 'number'
      }
    },
    quantity: {
      label: '数量',
      props: {
        type: 'number'
      }
    },
    material: {
      label: '材质'
    },
    material_percent: {
      label: '各使⽤材料占⽐'
    },
    product_manual: {
      label: '产品⽂档',
      tag: WrapPhotos,
      initValue: productDetail.product_manual,
      props: {
        bindUploadProps: {},
        isEdit: isEdit,
        setFieldsValue: (result) => {
          setFieldsValue({product_manual: result})
        }
      },
      rules: []
    },
    manufactured_at: {
      label: '⽣产时间',
      tag: DatePicker,
      initValue: productDetail.manufactured_at ? moment(productDetail.manufactured_at, 'YYYY-MM-DD HH:mm') : null,
      props: {
        placeholder: '请选择⽣产时间',
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm'
      }
    },
    send_date: {
      label: '发件⽇期',
      tag: DatePicker,
      initValue: productDetail.send_date ? moment(productDetail.send_date, 'YYYY-MM-DD HH:mm') : null,
      props: {
        placeholder: '请选择发件⽇期',
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm'
      }
    },
    delivery_date: {
      label: '收件⽇期',
      tag: DatePicker,
      initValue: productDetail.delivery_date ? moment(productDetail.delivery_date, 'YYYY-MM-DD HH:mm') : null,
      props: {
        placeholder: '请选择收件⽇期',
        showTime: { format: 'HH:mm' },
        format: 'YYYY-MM-DD HH:mm'
      }
    },
    pkg_name: {
      label: '运送物品名称'
    },
    pkg_quantity: {
      label: '运送量',
      props: {
        type: 'number'
      }
    },
    sender_name: {
      label: '发件⽅名称'
    },
    sender_address: {
      label: '发件⽅地址'
    },
    receiver_name: {
      label: '收件⽅名称'
    },
    receiver_address: {
      label: '收件⽅地址'
    },
    shipping_company: {
      label: '物流公司名称'
    },
    shipping_no: {
      label: '物流单号'
    },
    // status: {
    //   label: '状态',
    //   tag: Select,
    //   props: {
    //     placeholder: '请选择状态',
    //     className: 'select-status',
    //     getPopupContainer: () => document.getElementsByClassName('select-status')[0]
    //   },
    //   children: Object.entries(LiveStreamingStatus).map(item => <Option value={item[0]} key={item[0]}>{item[1]}</Option>)
    // }
  }

  const renderDetail = (key) => {
    switch (key) {
      case 'product_manual':
        return productDetail.card_photo ? <img src={productDetail.card_photo.url} className='cover-photo'/> : '-'
      default :
        return productDetail[key] || '-'
    }
  }

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">产品详情</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>编辑</Button>
        {productDetail.id && <Popconfirm
          title="确定删除产品？"
          onConfirm={confirmDeleteRecord}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" style={{marginLeft: 20}}>删除</Button>
        </Popconfirm>}
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label='ID'>
            <div>{productDetail.id || '-'}</div>
          </Item>
          <Item label='名称'>
            <div>{productDetail.name || '-'}</div>
          </Item>
          {/* 品牌（brand.name，点击进⼊品牌详情brand_id） */}
          <Item label='品牌'>
            <div>{(productDetail.brand && productDetail.brand.name) || '-'}</div>
          </Item>
          {Object.keys(renderDetailForm).map(key => {
            return <Item label={renderDetailForm[key].label || ''} key={key}>
              {getFieldDecorator(key, {
                rules:  renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}不能为空!` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (productDetail[key] || undefined)
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
