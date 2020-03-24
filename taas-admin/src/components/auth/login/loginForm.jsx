import React, { useState, useEffect } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import * as actions from '../../../redux/action'
import { connect } from 'react-redux'
import './loginForm.css'

function Login(props) {

  useEffect(() => {
    console.log(1111, props)
  }, [])

  const [loading, useLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        useLoading(true)
        window.send.post('users/admin_login?admin=true', {user: values}).then(data => {
          document.cookie = `token=${data.data.authentication_token}`
          window.localStorage.setItem('userInfo', JSON.stringify(data.data))
          props.saveUserInfo(data.data)
          props.history.push('/app/userList/list')
        }).catch(err => {
          useLoading(false)
        })
      }
    });
  }

  const { getFieldDecorator } = props.form

  return (
    <div className='login-container'>
      <Form onSubmit={handleSubmit} className="login-form">
        <div className="form-title">Harmay后台管理系统</div>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: 'Please input your E-mail!' },
              {type: 'email', message: 'The input is not valid E-mail!'}
            ],
            validateTrigger: 'onBlur'
          })(
            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item className='user-setting-item'>
          <div className='user-setting'>
            {/* <a href="javascript:void(0)" onClick={this.forgetPassword}>Forgot password</a>
            <a href="javascript:void(0)" onClick={this.registerAccount}>register now!</a> */}
          </div>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" className="login-form-button" loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )

}
const LoginForm = Form.create({})(Login);

function mapStateToProps(state) {
  return {
    userInfo: state.UserInfoReducer.userInfo
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveUserInfo: (userInfo) => dispatch({ type: actions.SAVE_USER_INFO, userInfo })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
