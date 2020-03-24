import React from 'react';
import { Form, Spin } from 'antd';
import './index.css'
function Application(props) {

  return (
    <Spin className='form-container' tip='Loading...'>
    </Spin>
  )
}

const WrappedApplicationForm = Form.create()(Application);
export default WrappedApplicationForm
