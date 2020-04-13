import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, DatePicker } from 'antd';
import UploadImg from '../../common/uploadImg/index'
import '../../common/uploadImg/index.css'
import moment from 'moment'
import WrapPhotos from '../../common/wrapPhotos/index'
import { LinkOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

const { createElement } = React
const { Item } = Form

function Application(props) {
  let productId = props.match.params.id
  const { explain, lang } = props
  useEffect(() => {
    if (productId) {
      getProductDetail()
    }
  }, [])

  const [productDetail, useProductDetail] = useState({})

  function getProductDetail() {
    window.send.get(`products/${productId}`).then(data => {
      useProductDetail(data.data)
      useLoading(false)
    })
    .catch(err => {
      useLoading(false)
    })
  }

  const [loading, useLoading] = useState(() => Boolean(productId))

  const [isEdit, useIsEdit] = useState(() => !Boolean(productId))

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        useLoading(true)
        let params = Object.assign({}, values)
        if (params.product_manual_id) {
          params.product_manual_id = params.product_manual_id.id
        }
        if (params.photo_ids) {
          params.photo_ids = params.photo_ids.map(i => i.id)
        }
        params.manufactured_at = moment(params.manufactured_at).format('YYYY-MM-DD')
        params.send_date = moment(params.send_date).format('YYYY-MM-DD')
        params.deliver_date = moment(params.deliver_date).format('YYYY-MM-DD')
        if (productDetail.id) {
          window.send.put(`products/${productDetail.id}`, {product: params})
          .then(data => {
            message.success('产品修改成功！')
            useProductDetail(data.data)
            useLoading(false)
            useIsEdit(false)
          })
          .catch(err => {
            useLoading(false)
          })
        } else {
          window.send.post(`products`, {product: params})
          .then(data => {
            message.success('产品创建成功！')
            useProductDetail(data.data)
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

  const confirmDeleteProduct = () => {
    useLoading(true)
    window.send.delete(`products/${productDetail.id}`)
    .then(data => {
      message.success('产品删除成功！')
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
    brand_id: {
      label: explain['Brand ID'],
      props: {
        type: 'number'
      }
    },
    name: {
      label: lang === 'zh_CN' ? '名称' : 'Name'
    },
    title: {
      label: explain['Procedure']
    },  
    wastage_percent: {
      label: explain['Material Loss Ratio'],
      rules: []
    },
    additive_percent: {
      label: explain['Additive Ratio'],
      rules: []
    },
    photo_ids: {
      label: explain['Product Pictures'],
      tag: WrapPhotos,
      initValue: productDetail.photos,
      props: {
        isEdit: isEdit,
        maxCount: 5,
        setFieldsValue: (result) => {
          setFieldsValue({photo_ids: result})
        }
      },
      rules: []
    },
    model: {
      label: explain['Model'],
    },
    size: {
      label: explain['Size'],
      rules: []
    },
    weight: {
      label: explain['Unit Weight'],
      rules: []
    },
    quantity: {
      label: explain['Quantity'],
      props: {
        type: 'number'
      },
      rules: []
    },
    material: {
      label: explain['Material'],
    },
    material_percent: {
      label: explain['Material Ratio'],
      rules: [ { required: false } ]
    },
    product_manual_id: {
      label: explain['Product Document'],
      tag: UploadImg,
      initValue: productDetail.product_manual,
      props: {
        bindUploadProps: {},
        setFieldsValue: (result) => {
          setFieldsValue({product_manual_id: result})
        }
      },
      rules: []
    },
    manufactured_at: {
      label: explain['Production Time'],
      tag: DatePicker,
      initValue: productDetail.manufactured_at ? moment(productDetail.manufactured_at, 'YYYY-MM-DD') : null,
      props: {
        placeholder: '请选择⽣产时间',
        format: 'YYYY-MM-DD'
      }
    },
    send_date: {
      label: explain['Shipping Date'],
      tag: DatePicker,
      initValue: productDetail.send_date ? moment(productDetail.send_date, 'YYYY-MM-DD') : null,
      props: {
        placeholder: '请选择发件⽇期',
        format: 'YYYY-MM-DD'
      },
      rules: [ { required: false } ]
    },
    deliver_date: {
      label: explain['Reception Date'],
      tag: DatePicker,
      initValue: productDetail.deliver_date ? moment(productDetail.deliver_date, 'YYYY-MM-DD') : null,
      props: {
        placeholder: '请选择收件⽇期',
        format: 'YYYY-MM-DD'
      },
      rules: [ { required: false } ]
    },
    pkg_name: {
      label: explain['Name of the Delivered Good'],
      rules: [ { required: false } ]
    },
    pkg_quantity: {
      label: explain['Quantity Delivered'],
      props: {
        type: 'number'
      },
      rules: [ { required: false } ]
    },
    sender_name: {
      label: explain['Consignor Name'],
      rules: [ { required: false } ]
    },
    sender_address: {
      label: explain['Consignor Address'],
      rules: [ { required: false } ]
    },
    receiver_name: {
      label: explain['Consignee Name'],
      rules: [ { required: false } ]
    },
    receiver_address: {
      label: explain['Consignee Address'],
      rules: [ { required: false } ]
    },
    shipping_company: {
      label: explain['Logistics Company Name'],
      rules: [ { required: false } ]
    },
    shipping_no: {
      label: explain['Tracking Number'],
      rules: [ { required: false } ]
    }
  }

  const isPDF = (value) => {
    if (value && value.url) {
      const fileType = value.url.slice(value.url.lastIndexOf(".") + 1).toLowerCase()
      return fileType === 'pdf'
    } else {
      return false
    }
  }

  const renderPDF = (value) => {
    const fileName = value.url.slice(value.url.lastIndexOf("/") + 1)
    return (
      <div className="pdf-file-container">
        <LinkOutlined />
        <span onClick={() => window.open(value.url)}>{fileName}</span>
      </div>
    )
  }

  const renderDetail = (key) => {
    switch (key) {
      case 'product_manual_id':
        return productDetail.product_manual ? (isPDF(productDetail.product_manual) ? renderPDF(productDetail.product_manual) : <img src={productDetail.product_manual.url} className='cover-photo'/>) : '-'
      case 'photo_ids':
        return productDetail.photos ? <WrapPhotos value={productDetail.photos} isEdit={isEdit} maxCount={5}/> : '-'
      default :
        return productDetail[key] || '-'
    }
  }

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">产品详情</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>{explain['Edit']}</Button>
        {productDetail.id && <Popconfirm
          title="确定删除产品？"
          onConfirm={confirmDeleteProduct}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" style={{marginLeft: 20}}>{explain['Delete']}</Button>
        </Popconfirm>}
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label='ID'>
            <div>{productDetail.id || '-'}</div>
          </Item>
          {productDetail.brand_id && <Item label={explain['Brand']}>
            <a
              onClick={(e) => { 
                e.preventDefault()
                productDetail.brand_id && props.history.push(`/app/brandList/detail/${productDetail.brand_id}`)
              }}>{productDetail.brand_name || '-'}</a>
          </Item>}
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
