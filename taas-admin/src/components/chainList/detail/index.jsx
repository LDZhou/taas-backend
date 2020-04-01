import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, Select, Table } from 'antd';
import UploadImg from '../../common/uploadImg/index'

const { createElement } = React
const { Item } = Form
const { Option } = Select

function Application(props) {
  let chainId = props.match.params.id
  useEffect(() => {
    if (chainId) {
      chainDetailInit()
    } else {
      createInit()
    }
  }, [])

  const [chainDetail, useChainDetail] = useState({})

  const [allproducts, useAllproducts] = useState([])

  function getAllProducts () {
    return window.send.get(`products`)
  }

  function getChainDetail () {
    return window.send.get(`chains/${chainId}`)
  }

  function chainDetailInit () {
    Promise.all([getAllProducts(), getChainDetail()])
    .then(vals => {
      useAllproducts(vals[0].data)
      useChainDetail(vals[1].data)
      useLoading(false)
    })
  }

  function createInit () {
    getAllProducts()
    .then(data => {
      useAllproducts(data.data)
      useLoading(false)
    })
  }

  const [loading, useLoading] = useState(() => Boolean(chainId))

  const [isEdit, useIsEdit] = useState(() => !Boolean(chainId))

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        useLoading(true)
        let params = Object.assign({}, values)
        if (params.cover_photo_id) {
          params.cover_photo_id = params.cover_photo_id.id
        }
        if (params.share_photo_id) {
          params.share_photo_id = params.share_photo_id.id
        }
        if (chainDetail.id) {
          window.send.put(`chains/${chainDetail.id}`, {chain: params})
          .then(data => {
            message.success('链条修改成功！')
            useChainDetail(data.data)
            useLoading(false)
            useIsEdit(false)
          })
          .catch(err => {
            useLoading(false)
          })
        } else {
          window.send.post(`chains`, {chain: params})
          .then(data => {
            message.success('链条创建成功！')
            useChainDetail(data.data)
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

  const confirmDeleteChain = () => {
    useLoading(true)
    window.send.delete(`chains/${chainDetail.id}`)
    .then(data => {
      message.success('链条删除成功！')
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
    total_views: {
      label: '扫码次数'
    },
    cover_photo_id: {
      label: '预览图',
      tag: UploadImg,
      initValue: chainDetail.cover_photo,
      props: {
        bindUploadProps: {},
        setFieldsValue: (result) => {
          setFieldsValue({cover_photo_id: result})
        }
      },
      rules: [
        { required: true, message: ' ' },
        { validator:(_, value) => value ? Promise.resolve() : Promise.reject('请选择上传预览图!') }
      ]
    },
    share_photo_id: {
      label: '⼆维码分享图',
      tag: UploadImg,
      initValue: chainDetail.share_photo,
      props: {
        bindUploadProps: {},
        setFieldsValue: (result) => {
          setFieldsValue({share_photo_id: result})
        }
      },
      rules: [
        // { required: false, message: ' ' },
        // { validator:(_, value) => value ? Promise.resolve() : Promise.reject('请选择上传⼆维码分享图!') }
      ]
    }
  }

  const renderDetail = (key) => {
    switch (key) {
      case 'cover_photo_id':
        return chainDetail.cover_photo ? <img src={chainDetail.cover_photo.url} className='cover-photo'/> : '-'
      case 'share_photo_id':
          return chainDetail.share_photo ? <img src={chainDetail.share_photo.url} className='cover-photo'/> : '-'
      default :
        return chainDetail[key] || '-'
    }
  }

  let columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: text => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            props.history.push(`/app/productList/detail/${text}`)
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
            props.history.push(`/app/productList/detail/${record.id}`)
          }}>{text}</a>
        </span>
      ),
      width: 180
    },
    {
      title: '品牌',
      dataIndex: 'brand_name',
      render: (text, record) => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            props.history.push(`/app/brandList/detail/${record.brand_id}`)
          }}>{text}</a>
        </span>
        )
    },
    {
      title: '型号',
      dataIndex: 'model'
    },
    {
      title: '尺⼨',
      dataIndex: 'size'
    },
    {
      title: '数量',
      dataIndex: 'quantity'
    },
    {
      title: '材质',
      dataIndex: 'material'
    },
    {
      title: '生产日期',
      dataIndex: 'manufactured_at'
    },
    {
      title: '发件⽇期',
      dataIndex: 'send_date'
    },
    {
      title: '收件⽇期',
      dataIndex: 'deliver_date'
    },
    {
      title: '收件⽅名称',
      dataIndex: 'receiver_name'
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
          {chainDetail.id && !isEdit && <Item label='二维码'>
            <div>
              {chainDetail.qr_code ? <img src={chainDetail.qr_code.url} className='cover-photo'/> : '-'}
            </div>
          </Item>}
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

      {!isEdit && chainDetail.products && <Fragment>
        <div className='title-container title-container-next'>
          <h2 className="sub-title-text">产品列表</h2>
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
