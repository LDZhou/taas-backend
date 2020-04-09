import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, DatePicker } from 'antd';
import UploadImg from '../../common/uploadImg/index'
import '../../common/uploadImg/index.css'
import moment from 'moment'
import WrapPhotos from '../../common/wrapPhotos/index'
import { LinkOutlined } from '@ant-design/icons'

const { createElement } = React
const { Item } = Form

function Application(props) {
  let productId = props.match.params.id
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
      label: '品牌ID',
      props: {
        type: 'number'
      }
    },
    name: {
      label: '名称'
    },
    title: {
      label: '步骤分类'
    },  
    wastage_percent: {
      label: '材料损耗⽐例',
      rules: []
    },
    additive_percent: {
      label: '添加物⽐例',
      rules: []
    },
    photo_ids: {
      label: '产品图⽚',
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
      label: '型号'
    },
    size: {
      label: '尺⼨',
      rules: []
    },
    weight: {
      label: '克重',
      rules: []
    },
    quantity: {
      label: '数量',
      props: {
        type: 'number'
      },
      rules: []
    },
    material: {
      label: '材质'
    },
    material_percent: {
      label: '各使⽤材料占⽐',
      rules: [ { required: false } ]
    },
    product_manual_id: {
      label: '产品⽂档',
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
      label: '⽣产时间',
      tag: DatePicker,
      initValue: productDetail.manufactured_at ? moment(productDetail.manufactured_at, 'YYYY-MM-DD') : null,
      props: {
        placeholder: '请选择⽣产时间',
        format: 'YYYY-MM-DD'
      }
    },
    send_date: {
      label: '发件⽇期',
      tag: DatePicker,
      initValue: productDetail.send_date ? moment(productDetail.send_date, 'YYYY-MM-DD') : null,
      props: {
        placeholder: '请选择发件⽇期',
        format: 'YYYY-MM-DD'
      },
      rules: [ { required: false } ]
    },
    deliver_date: {
      label: '收件⽇期',
      tag: DatePicker,
      initValue: productDetail.deliver_date ? moment(productDetail.deliver_date, 'YYYY-MM-DD') : null,
      props: {
        placeholder: '请选择收件⽇期',
        format: 'YYYY-MM-DD'
      },
      rules: [ { required: false } ]
    },
    pkg_name: {
      label: '运送物品名称',
      rules: [ { required: false } ]
    },
    pkg_quantity: {
      label: '运送量',
      props: {
        type: 'number'
      },
      rules: [ { required: false } ]
    },
    sender_name: {
      label: '发件⽅名称',
      rules: [ { required: false } ]
    },
    sender_address: {
      label: '发件⽅地址',
      rules: [ { required: false } ]
    },
    receiver_name: {
      label: '收件⽅名称',
      rules: [ { required: false } ]
    },
    receiver_address: {
      label: '收件⽅地址',
      rules: [ { required: false } ]
    },
    shipping_company: {
      label: '物流公司名称',
      rules: [ { required: false } ]
    },
    shipping_no: {
      label: '物流单号',
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
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>编辑</Button>
        {productDetail.id && <Popconfirm
          title="确定删除产品？"
          onConfirm={confirmDeleteProduct}
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
          {productDetail.brand_id && <Item label='品牌'>
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

const WrappedApplicationForm = Form.create()(Application);
export default WrappedApplicationForm
