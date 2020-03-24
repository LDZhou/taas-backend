import React from 'react';
import { Form, Spin } from 'antd';
function Application(props) {

  return (
    <Spin className='form-container' tip='Loading...'>
    </Spin>
  )
}

const WrappedApplicationForm = Form.create()(Application);
export default WrappedApplicationForm
