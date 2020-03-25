import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, Select, Table } from 'antd';
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

  const [chainDetail, useChainDetail] = useState({})

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
  //     useChainDetail(vals[0].data)
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
        console.log('val =>', params)
        // if (chainDetail.id) {
        //   window.send.put(`events/${chainDetail.id}`, {event: params})
        //   .then(data => {
        //     message.success('产品修改成功！')
        //     useChainDetail(data.data)
        //     useLoading(false)
        //   })
        // } else {
        //   window.send.post(`events`, {event: params})
        //   .then(data => {
        //     message.success('产品创建成功！')
        //     useChainDetail(data.data)
        //     useLoading(false)
        //   })
        //   .catch(err => {
        //     useLoading(false)
        //   })
        // }
      }
    });
  };

  const confirmDeleteChain = () => {
    // useLoading(true)
    // window.send.delete(`events/${chainDetail.id}`)
    // .then(data => {
    //   message.success('链条删除成功！')
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
    cover_photo: {
      label: '预览图',
      tag: UploadImg,
      initValue: chainDetail.cover_photo,
      props: {
        bindUploadProps: {},
        setFieldsValue: (result) => {
          setFieldsValue({cover_photo: result})
        }
      },
      rules: []
    },
    share_photo: {
      label: '⼆维码分享图',
      tag: UploadImg,
      initValue: chainDetail.share_photo,
      props: {
        bindUploadProps: {},
        setFieldsValue: (result) => {
          setFieldsValue({share_photo: result})
        }
      },
      rules: []
    }
  }

  const renderDetail = (key) => {
    switch (key) {
      case 'cover_photo':
        return chainDetail.cover_photo ? <img src={chainDetail.cover_photo.url} className='cover-photo'/> : '-'
      case 'share_photo':
          return chainDetail.share_photo ? <img src={chainDetail.share_photo.url} className='cover-photo'/> : '-'
      default :
        return chainDetail[key] || '-'
    }
  }
  // ID（product_id 可以点击跳转到产品详情），名称 （product.name），
  // 品牌（product.brand_name），⽣产时间 product.manufactured_at
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: text => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            props.history.push(`/app/commodityList/detail/${text}`)
          }}>{text}</a>
        </span>
      )
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            props.history.push(`/app/commodityList/detail/${record.id}`)
          }}>{text}</a>
        </span>
      ),
      width: 180
    },
    {
      title: '品牌',
      dataIndex: 'description',
      render: (text, record) => record.product ? record.product.brand_name : '-'
    },
    {
      title: '⽣产时间',
      dataIndex: 'description1',
      render: (text, record) => record.product ? record.product.manufactured_at : '-'
    }
  ]

  const allproducts = [
    {
      name: '产品1',
      id: 1
    },
    {
      name: '产品2',
      id: 2
    },
    {
      name: '产品3',
      id: 3
    },
    {
      name: '产品4',
      id: 4
    },
    {
      name: '产品5',
      id: 5
    }
  ]

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">链条详情</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>编辑</Button>
        {chainDetail.id && <Popconfirm
          title="确定删除链条？"
          onConfirm={confirmDeleteChain}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" style={{marginLeft: 20}}>删除</Button>
        </Popconfirm>}
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label='ID'>
            <div>{chainDetail.id || '-'}</div>
          </Item>
          {isEdit && <Item label="产品链条">
            {getFieldDecorator('product_ids', {
                rules: [
                  { required: true, message: ' ' },
                  { validator:(_, value) => value && value.length === 5 ? Promise.resolve() : Promise.reject('请选择五个产品!') }
                ],
                initialValue: chainDetail.products ? chainDetail.products.map(i => i.id) : []
              })(
                <Select
                  placeholder='请选择产品'
                  mode='multiple'
                  optionFilterProp='children'
                  className='select-products-ids'
                  getPopupContainer={() => document.getElementsByClassName('select-products-ids')[0]}>
                  {allproducts.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>
            )}
          </Item>}
          {Object.keys(renderDetailForm).map(key => {
            return <Item label={renderDetailForm[key].label || ''} key={key}>
              {getFieldDecorator(key, {
                rules:  renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}不能为空!` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (chainDetail[key] || undefined)
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

      {chainDetail.products && <Fragment>
        <div className='title-container title-container-next'>
          <h2 className="title-text">产品列表</h2>
        </div>
        <Table
          className='list-table'
          bordered={true}
          rowKey='id'
          columns={columns}
          pagination={false}
          dataSource={chainDetail.products}/>
      </Fragment>}
    </Spin>
  )
}

const WrappedApplicationForm = Form.create()(Application);
export default WrappedApplicationForm
