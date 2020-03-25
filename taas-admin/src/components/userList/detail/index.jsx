import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Spin, Select, DatePicker, Table } from 'antd';
import UploadImg from '../../common/uploadImg/index'
import moment from 'moment'
import { baseURL } from '../../../request'
// import { BrandType } from '../../../utils/utils'

const { Option } = Select
const { createElement } = React
const { Item } = Form

function Application(props) {
  let userId = props.match.params.id
  useEffect(() => {
    if (userId) {
      getUserDetail()
    }
  }, [])

  const [userDetail, useUserDetail] = useState({})

  function getUserDetail () {
    // window.send.get(`users/${userId}`)
    // .then(data => {
    //   const courseData = data.data
    //   useUserDetail(courseData)
    //   useLoading(false)
    // })
    useLoading(false)
  }

  const [loading, useLoading] = useState(true)

  const [isEdit, useIsEdit] = useState(false)

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        // useLoading(true)
        // let params = Object.assign({}, values)
        // delete params.avatar
        // params.date_of_birth = moment(params.date_of_birth).format('YYYY-MM-DD')
        // window.send.put(`users/${userId}`, {user: params})
        // .then(data => {
        //   useUserDetail(data.data)
        //   useLoading(false)
        // })
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
      label: '姓名',
    },
    gender: {
      label: '性别',
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
      label: '类别',
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
      label: '邮箱'
    },
    date_of_birth: {
      label: '⽣⽇',
      tag: DatePicker,
      initValue: userDetail.date_of_birth ? moment(userDetail.date_of_birth, 'YYYY年MM月DD日') : null,
      props: {
        placeholder: '请选择⽣⽇'
      }
    },
    phone: {
      label: '⼿机号',
      props: {
        type: 'number'
      }
    },
    password: {
      label: '密码',
      initValue: '',
      rules: []
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
    { // 点击进入链条详情chain.id
      title: '链条名称',
      dataIndex: 'chain.name',
      render: text => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            // props.history.push(`/app/orderList/detail/${id}`)
          }}>{text}</a>
        </span>
      )
    },
    { // target_id点击 进⼊产品详情
      title: '产品名称',
      dataIndex: 'target.name',
      render: text => (
        <span>
          <a onClick={(e) => {
            e.preventDefault()
            // props.history.push(`/app/orderList/detail/${id}`)
          }}>{text}</a>
        </span>
      )
    },
    {
      title: '浏览时间',
      dataIndex: 'created_at'
    },
    {
      title: '地点',
      dataIndex: 'address'
    }
  ]

  return (
    <Spin className='form-container' tip='Loading...' spinning={loading}>
      <div className='title-container'>
        <h2 className="title-text">用户详情</h2>
        <Button type='primary' onClick={() => { useIsEdit(true) }} disabled={isEdit}>编辑</Button>
      </div>
      <Form className='form-content-container' {...formItemLayout} onSubmit={handleSubmit}>
        <div className='form-content-wrap'>
          <Item label={<span>ID</span>}>
            <div>{userDetail.id || '-'}</div>
          </Item>
          <Item label="头像">
            {getFieldDecorator('avatar', {
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
            )}
          </Item>
          <Item label={<span>年龄</span>}>
            <div>{userDetail.age}岁</div>
          </Item>
          {Object.keys(renderDetailForm).map(key => {
            return <Item label={renderDetailForm[key].label || ''} key={key}>
              {getFieldDecorator(key, {
                rules: renderDetailForm[key].rules || [{ required: true, message: `${renderDetailForm[key].label}不能为空!` }],
                initialValue: renderDetailForm[key].initValue !== undefined ? renderDetailForm[key].initValue : (userDetail[key] || undefined)
              })(
                isEdit ? createElement(
                  renderDetailForm[key].tag || Input,
          Object.assign({}, {placeholder: `请输入${renderDetailForm[key].label}`}, renderDetailForm[key].props), renderDetailForm[key].children) : <div>{renderDetail(key)}</div>
              )}
          </Item>
          })}
          <Item label='注册⽇期'>
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
          <h2 className="title-text">浏览记录</h2>
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

const WrappedApplicationForm = Form.create()(Application);
export default WrappedApplicationForm
