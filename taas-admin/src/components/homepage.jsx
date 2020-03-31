import React, {Component} from 'react'
import { Layout, Menu, Icon, Button } from 'antd';
import {HashRouter, Route, Switch} from 'react-router-dom'
import UserList from './userList/index'
import BrandList from './brandList/index'
import ProductList from './productList/index'
import ChainList from './chainList/index'
import Logo from '../assets/logo@2x.png'
import './homepage.css'
import {checkLogin} from '../utils/utils'
import { connect } from 'react-redux'
import * as actions from '../redux/action'

const { Header, Content, Sider } = Layout;
class Homepage extends Component {
  state = {
    menuKey: ''
  }

  componentDidMount () {
    checkLogin(this)
    const keys = this.props.location.pathname.split('/')
    this.setState({ menuKey: keys[2] ? keys[2] : '' })
  }

  menuClick = ({ item, key, keyPath }) => {
    this.setState({menuKey: key})
    this.props.history.push(`/app/${key}/list`)
  }

  signOut = () => {
    window.document.cookie = `token=1;expires=${new Date(0).toGMTString()}`
    window.localStorage.clear()
    this.props.deleteUserInfo()
    this.props.history.push('/auth/login')
  }

  render() {
    const { menuKey } = this.state
    const { userInfo } = this.props
    return (
      <Layout style={{height: '100vh'}}>
        <Sider
          breakpoint="lg"
          // onBreakpoint={(broken) => { console.log(broken); }}
          // onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className="homepage-logo">
            <img src={Logo}/>
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={[menuKey]} onClick={this.menuClick} className='homepage-menus'>
            <Menu.Item key="userList">
              <Icon type="user" />
              <span className="nav-text">用户列表</span>
            </Menu.Item>
            <Menu.Item key="productList">
              <Icon type="book" />
              <span className="nav-text">产品列表</span>
            </Menu.Item>
            <Menu.Item key="brandList">
              <Icon type="read" />
              <span className="nav-text">品牌列表</span>
            </Menu.Item>
            <Menu.Item key="chainList">
              <Icon type="file-protect" />
              <span className="nav-text">链条列表</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <div className="login-info">
              <span className="login-sitename">Trashaus管理后台</span>
              <span className='login-name'>欢迎你，{userInfo && userInfo.nickname} （管理员）</span>
              <Button onClick={this.signOut} type='link' className='logout-btn'>退出</Button>
            </div>
          </Header>
          <Content className='content-container'>
            <div className='content-container-wrap'>
              <HashRouter>
                <Switch>
                    <Route path='/app/userList' component={UserList}/>
                    <Route path='/app/brandList' component={BrandList}/>
                    <Route path='/app/productList' component={ProductList}/>
                    <Route path='/app/chainList' component={ChainList}/>
                </Switch>
              </HashRouter>
            </div>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer> */}
        </Layout>
      </Layout>
    )
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.UserInfoReducer.userInfo
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteUserInfo: () => dispatch({ type: actions.DELETE_USER_INFO })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
