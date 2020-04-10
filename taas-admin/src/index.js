import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import request from './request'
import { createStore } from 'redux'
import { Provider } from "react-redux";
import Reducers from "./redux/reducers";
// import actions from "./redux/action";
import moment from 'moment';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import en_US from 'antd/es/locale-provider/en_US';
import 'moment/locale/zh-cn';
import { connect } from 'react-redux'
import { ConfigProvider } from 'antd';

moment.locale('zh-cn')

window.send = request

const store = createStore(Reducers)
console.log('store',store)
class WrapApp extends Component {
  render() {
    const { lang } = this.props
    return (
      <ConfigProvider locale={lang === 'zh_CN' ? zh_CN : en_US}>
        <App />
      </ConfigProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    lang: state.LangReducer.lang
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const StoreWrapApp = connect(mapStateToProps, mapDispatchToProps)(WrapApp)

ReactDOM.render(
  <Provider store={store}>
    <StoreWrapApp />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
