import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import request from './request'
import { createStore } from 'redux'
import { Provider } from "react-redux";
import Reducers from "./redux/reducers";
import moment from 'moment';
import { LocaleProvider } from 'antd';
import 'moment/locale/zh-cn';
import zh_CN from 'antd/es/locale-provider/zh_CN';

moment.locale('zh-cn')

window.send = request

const store = createStore(Reducers)
ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zh_CN}>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
