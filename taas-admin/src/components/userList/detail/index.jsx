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
  const { explain, lang } = props
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
          message.success(`${explain['User']}${explain[' modified successfully!']}`)
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
        placeholder: `${explain['Please select the ']}${explain['Gender']}`
      },
      children: [
        <Option value={0} key={1}>{lang === 'zh_CN' ? '男' : 'male'}</Option>,
        <Option value={1} key={2}>{lang === 'zh_CN' ? '女' : 'female'}</Option>
      ]
    },
    user_type: {
      label: explain['Type'],
      tag: Select,
      initValue: userDetail.user_type,
      props: {
        placeholder: `${explain['Please select the ']}${explain['Type']}`
      },
      children: [
        <Option value={0} key={0}>{lang === 'zh_CN' ? '⽤户' : 'User'}</Option>,
        <Option value={1} key={1}>{lang === 'zh_CN' ? '品牌负责⼈' : 'Brand Representative User'}</Option>
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
        placeholder: `${explain['Please select the ']}${explain['Date of Birth']}`
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
        { max: 11, message: lang === 'zh_CN' ? '⼿机号长度不超过11位！' : 'The length of the phone number must not exceed 11 digits!' }
      ]
    },
    password: {
      label: explain['Password'],
      initValue: '',
      rules: [{ min: 6, message: lang === 'zh_CN' ? '密码长度不能小于六位！' : 'Password length must not be less than six!' }]
    }
  }

  
  const renderDetail = (key) => {
    switch (key) {
      case 'gender':
        return (lang === 'zh_CN' ? ['男', '女'][userDetail.gender] : ['male', 'female'][userDetail.gender]) || '-'
      case 'user_type':
        return (lang === 'zh_CN' ? ['⽤户', '品牌负责⼈'][userDetail.user_type] : ['User', 'Brand Representative User'][userDetail.user_type]) || '-'
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
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>{explain['Edit']}</Button>
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
                // rules: renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}${explain[' cannot be empty!']}` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (userDetail[key] || undefined)
              })(
                isEdit ? createElement(
                  renderDetailForm[key].tag || Input,
          Object.assign({}, {placeholder: `${explain['Please enter the ']}${renderDetailForm[key].label}`}, renderDetailForm[key].props), renderDetailForm[key].children) : <div>{renderDetail(key)}</div>
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
                  {explain['Save']}
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
    lang: state.LangReducer.lang,
    explain: state.ExplainReducer.explain,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Application))
