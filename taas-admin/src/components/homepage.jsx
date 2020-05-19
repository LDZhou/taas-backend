import React, {Component, Fragment} from 'react'
import { Layout, Menu, Icon, Button } from 'antd';
import {HashRouter, Route, Switch} from 'react-router-dom'
import UserList from './userList/index'
import BrandList from './brandList/index'
import ProductList from './productList/index'
import ChainList from './chainList/index'
import Logo from '../assets/logo@2x.png'
import './homepage.css'
import {checkLogin, explain} from '../utils/utils'
import { connect } from 'react-redux'
import * as actions from '../redux/action'

const { Header, Content, Sider } = Layout;
class Homepage extends Component {
  state = {
    menuKey: '',
    collapsed: false
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

  SwitchLang = (val) => {
    if (val === 'zh_CN') {
      this.props.changeZhExplain(explain)
    } else {
      this.props.changeEnExplain(explain)
    }
    this.props.changeLang(val)
    
  }

  render() {
    const { menuKey, collapsed } = this.state
    const { userInfo, explain, lang } = this.props
    return (
      <Layout style={{height: '100vh'}}>
        <Sider
          breakpoint="lg"
          // onBreakpoint={(broken) => { console.log(broken); }}
          onCollapse={(collapsed, type) => { this.setState({ collapsed }) }}
        >
          <div className="homepage-logo">
            <img src={Logo} style={{maxWidth: collapsed ? '100%' : 174}}/>
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={[menuKey]} onClick={this.menuClick} className='homepage-menus'>
            <Menu.Item key="userList">
              <Icon type="user" />
              <span className="nav-text">{explain['User List']}</span>
            </Menu.Item>
            {userInfo && !userInfo.brand && <Menu.Item key="productList">
              <Icon type="book" />
              <span className="nav-text">{explain['Product List']}</span>
            </Menu.Item>}
            {userInfo && !userInfo.brand && <Menu.Item key="brandList">
              <Icon type="read" />
              <span className="nav-text">{explain['Brand List']}</span>
            </Menu.Item>}
            <Menu.Item key="chainList">
              <Icon type="file-protect" />
              <span className="nav-text">{explain['Chain List']}</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <div className="login-info">
              <div className='switch-lang-container'>
                <div className={lang === 'zh_CN' ? 'active' : ''} onClick={() => this.SwitchLang('zh_CN')}>中文</div>
                <div className={lang === 'zh_CN' ? '' : 'active'} onClick={() => this.SwitchLang('en_US')}>Eng</div>
              </div>
              <span className="login-sitename">{explain['TRASHAUS CRM System']}</span>
              <span className='login-name'>{explain['Welcome']}，{userInfo && userInfo.nickname} （{explain['Administrator']}）</span>
              <Button onClick={this.signOut} type='link' className='logout-btn'>{explain['Log Out']}</Button>
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
    userInfo: state.UserInfoReducer.userInfo,
    explain: state.ExplainReducer.explain,
    lang: state.LangReducer.lang
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteUserInfo: () => dispatch({ type: actions.DELETE_USER_INFO }),
    changeLang: (lang) => dispatch({ type: actions.SET_LANG_TYPE, lang }),
    changeEnExplain: (explain) => dispatch({ type: actions.SET_EN_EXPLAIN, explain }),
    changeZhExplain: (explain) => dispatch({ type: actions.SET_ZH_EXPLAIN, explain }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
