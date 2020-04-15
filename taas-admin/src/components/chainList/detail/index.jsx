import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Popconfirm, message, Spin, Select, Table } from 'antd';
import UploadImg from '../../common/uploadImg/index'
import { connect } from 'react-redux'

const { createElement } = React
const { Item } = Form
const { Option } = Select

function Application(props) {
  let chainId = props.match.params.id
  const { explain, lang } = props
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
            message.success(`${explain['Chain']}${explain[' modified successfully!']}`)
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
            message.success(`${explain['Chain']}${explain[' created successfully!']}`)
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
      message.success(`${explain['Chain']}${explain[' deleted successfully!']}`)
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
      label: lang === 'zh_CN' ? '名称' : 'Name',
    },
    cover_photo_id: {
      label: explain['Preview Image'],
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
        { validator:(_, value) => value ? Promise.resolve() : Promise.reject(lang === 'zh_CN' ? '请上传预览图！' : (explain['Please upload the '] + explain['Preview Image'] + '!')) }
      ]
    },
    share_photo_id: {
      label: <span title={explain['(Recommended width and height 16:25)']}>{explain['Share Image']}</span>,
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
      title: lang === 'zh_CN' ? '名称' : 'Name',
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
      title: explain['Brand'],
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
      title: explain['Model'],
      dataIndex: 'model'
    },
    {
      title: explain['Size'],
      dataIndex: 'size'
    },
    {
      title: explain['Quantity'],
      dataIndex: 'quantity'
    },
    {
      title: explain['Material'],
      dataIndex: 'material'
    },
    {
      title: explain['Production Time'],
      dataIndex: 'manufactured_at'
    },
    {
      title: explain['Shipping Date'],
      dataIndex: 'send_date'
    },
    {
      title: explain['Consignor Name'],
      dataIndex: 'sender_name'
    },
    {
      title: explain['Reception Date'],
      dataIndex: 'deliver_date'
    },
    {
      title: explain['Consignee Name'],
      dataIndex: 'receiver_name'
    }
  ]

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">{explain['Chain Details']}</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>{explain['Edit']}</Button>
        {chainDetail.id && <Popconfirm
          title={explain['Sure to delete?']}
          onConfirm={confirmDeleteChain}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" style={{marginLeft: 20}}>{explain['Delete']}</Button>
        </Popconfirm>}
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label='ID'>
            <div>{chainDetail.id || '-'}</div>
          </Item>
          {!isEdit && <Item label={explain['Number of Views']}>
            <div>{chainDetail.total_views}{explain['times']}</div>
          </Item>}
          {isEdit && <Item label={<span title={explain['Choosing Products of the Chain']}>{lang === 'zh_CN' ? explain['Choosing Products of the Chain'] : 'Choosing Products...'}</span>}>
            {getFieldDecorator('product_ids', {
                rules: [
                  { required: true, message: ' ' },
                  {
                    validator:(_, value) => {
                      return value && value.length >= 2 && value.length <= 10 ? Promise.resolve() : Promise.reject(lang === 'zh_CN' ? '请选择2-10个产品!' : 'Please choose 2-10 products!')
                    }
                  }
                ],
                initialValue: chainDetail.products ? chainDetail.products.map(i => i.id) : []
              })(
                <Select
                  placeholder={`${explain['Please select the ']}${explain['Products']}`}
                  mode='multiple'
                  optionFilterProp='children'
                  className='select-products-ids'
                  getPopupContainer={() => document.getElementsByClassName('select-products-ids')[0]}>
                  {allproducts.map(item => <Option key={item.id} value={item.id}>{item.name}-{item.title}</Option>)}
                </Select>
            )}
          </Item>}
          {Object.keys(renderDetailForm).map(key => {
            return <Item label={renderDetailForm[key].label || ''} key={key}>
              {getFieldDecorator(key, {
                rules:  renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}${explain[' cannot be empty!']}` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (chainDetail[key] || undefined)
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
          {chainDetail.id && !isEdit && <Item label={explain['QR code']}>
            <div>
              {chainDetail.qr_code ? <img src={chainDetail.qr_code.url} className='cover-photo'/> : '-'}
            </div>
          </Item>}
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

      {!isEdit && chainDetail.products && <Fragment>
        <div className='title-container title-container-next'>
          <h2 className="sub-title-text">{explain['Product List']}</h2>
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
