import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Spin, Select, DatePicker, Table, message } from 'antd';
// import UploadImg from '../../common/uploadImg/index'
import moment from 'moment'
// import { baseURL } from '../../../request'
import { connect } from 'react-redux'

const { Option } = Select
const { createElement } = React
const { Item } = Form

function Application(props) {
  let userId = props.match.params.id
  const { explain } = props
  useEffect(() => {
    if (userId) {
      getUserDetail()
    }
  }, [])

  const [userDetail, useUserDetail] = useState({})

  function getUserDetail () {
    window.send.get(`users/${userId}`)
    .then(data => {
      const courseData = data.data
      useUserDetail(courseData)
      useLoading(false)
    })
  }

  const [loading, useLoading] = useState(true)

  const [isEdit, useIsEdit] = useState(false)

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        useLoading(true)
        let params = Object.assign({}, values)
        delete params.avatar
        if (!params.password) delete params.password
        params.date_of_birth = moment(params.date_of_birth).format('YYYY-MM-DD')
        window.send.put(`users/${userId}`, {user: params})
        .then(data => {
          useUserDetail(data.data)
          message.success('用户修改成功！')
          useLoading(false)
          useIsEdit(false)
        })
        .catch(err => {
          useLoading(false)
        })
      }
    });
  };
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
    nickname: {
      label: explain['Name'],
    },
    gender: {
      label: explain['Gender'],
      tag: Select,
      initValue: userDetail.gender,
      props: {
        placeholder: '请选择性别'
      },
      children: [
        <Option value={0} key={1}>男</Option>,
        <Option value={1} key={2}>女</Option>
      ]
    },
    user_type: {
      label: explain['Type'],
      tag: Select,
      initValue: userDetail.user_type,
      props: {
        placeholder: '请选择类别'
      },
      children: [
        <Option value={0} key={0}>⽤户</Option>,
        <Option value={1} key={1}>品牌负责⼈</Option>
      ]
    },
    email: {
      label: explain['E-mail'],
      rules: [
        { required: false, message: ' ' },
      ]
    },
    date_of_birth: {
      label: explain['Date of Birth'],
      tag: DatePicker,
      initValue: userDetail.date_of_birth ? moment(userDetail.date_of_birth, 'YYYY年MM月DD日') : null,
      props: {
        placeholder: '请选择⽣⽇'
      },
      rules: [
        { required: false, message: ' ' },
      ]
    },
    phone: {
      label: explain['Mobile'],
      props: {
        type: 'number'
      },
      rules: [
        { required: false, message: ' ' },
        { max: 11, message: `⼿机号长度不超过11位!` }
      ]
    },
    password: {
      label: explain['Password'],
      initValue: '',
      rules: [{ min: 6, message: `密码长度不能小于六位!` }]
    }
  }

  
  const renderDetail = (key) => {
    switch (key) {
      case 'gender':
        return ['男', '女'][userDetail.gender] || '-'
      case 'user_type':
        return ['⽤户', '品牌负责⼈'][userDetail.user_type] || '-'
      default :
        return userDetail[key] || '-'
    }
  }
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: explain['Chain Name'],
      dataIndex: 'chain.name',
      render: (text, record) => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            props.history.push(`/app/chainList/detail/${record.chain.id}`)
          }}>{text}</a>
        </span>
      )
    },
    {
      title: explain['Product Name'],
      dataIndex: 'product_name',
      render: (text, record) => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            props.history.push(`/app/productList/detail/${record.product_id}`)
          }}>{text}</a>
        </span>
      )
    },
    {
      title: explain['Browsing Time'],
      dataIndex: 'created_at'
    },
    {
      title: explain['Browsing Location'],
      dataIndex: 'address'
    }
  ]

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">{explain['User Details']}</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>编辑</Button>
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label={<span>ID</span>}>
            <div>{userDetail.id || '-'}</div>
          </Item>
          <Item label={explain['Profile Picture']}>
            {/* {getFieldDecorator('avatar', {
                initialValue: {url: userDetail.avatar}
              })(
                isEdit ? <UploadImg
                bindUploadProps={{
                  action: baseURL + 'users/upload_photo?admin=1',
                  data: {
                    slug: userDetail.slug,
                    photo_type: 'avatar'
                  }
                }}
                imgClassName='head-img'
                canDelete={false}
                setFieldsValue={(result) => {
                  setFieldsValue({avatar: {url: result.data.avatar}})
                }}/> : <div>
                {userDetail.avatar && <img src={userDetail.avatar} style={{maxWidth: 100, maxHeight: 150, marginLeft: 16}}/>}
              </div>
            )} */}
            {userDetail.avatar ? <img src={userDetail.avatar} style={{maxWidth: 100, maxHeight: 150, marginLeft: 16}}/> : '-'}
          </Item>
          <Item label={explain['Age']}>
            <div>{userDetail.age}{explain['years']}</div>
          </Item>
          {Object.keys(renderDetailForm).map(key => {
            return <Item label={renderDetailForm[key].label || ''} key={key}>
              {getFieldDecorator(key, {
                // rules: renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}不能为空!` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (userDetail[key] || undefined)
              })(
                isEdit ? createElement(
                  renderDetailForm[key].tag || Input,
          Object.assign({}, {placeholder: `请输入${renderDetailForm[key].label}`}, renderDetailForm[key].props), renderDetailForm[key].children) : <div>{renderDetail(key)}</div>
              )}
          </Item>
          })}
          <Item label={explain['Registration Time']}>
            <div>{userDetail.created_at || '-'}</div>
          </Item>
          {isEdit && <Row style={{marginTop: 20}}>
            <Col span={22}>
              <Item className='save-button'>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Item>
            </Col>
          </Row>
          }
        </div>
      </Form>

      {userDetail.user_views && <Fragment>
        <div className='title-container title-container-next'>
          <h2 className="title-text">{explain['Browsing History']}</h2>
        </div>
        <Table
          className='list-table'
          bordered={true}
          rowKey='id'
          columns={columns}
          pagination={false}
          dataSource={userDetail.user_views}/>
      </Fragment>}
    </Spin>
  )
}

function mapStateToProps(state) {
  return {
    explain: state.ExplainReducer.explain,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Application))
