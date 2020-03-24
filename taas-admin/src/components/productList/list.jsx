import React, { Component } from 'react';
import {Table, Button} from 'antd'
import { LiveStreamingStatus } from '../../utils/utils'

class List extends Component {
  state={
    total: 0,
    page: 1,
    loading: false,
    data: [
    ]
  }
  componentDidMount () {
    // this.getList()
  }

  getList = () => {
    const { page } = this.state
    this.setState({ loading: true })
    window.send.get('events', {
      params: {
        page
      }
    })
    .then(data => {
      this.setState({ data: data.data, total: data.count, loading: false })
    })
  }

  addProduct = () => {
    this.props.history.push(`/app/productList/add`)
  }

  render() {
    const self = this
    const { data } = this.state
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: text => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/productList/detail/${text}`)
            }}>{text}</a>
          </span>
        )
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/productList/detail/${record.id}`)
            }}>{text}</a>
          </span>
        ),
        width: 180
      },
      {
        title: '品牌',
        dataIndex: 'brand.name'
      },
      {
        title: '型号',
        dataIndex: 'model'
      },
      {
        title: '尺⼨',
        dataIndex: 'size'
      },
      {
        title: '发件⽇期',
        dataIndex: 'send_date'
      },
      {
        title: '收件⽇期',
        dataIndex: 'delivery_date'
      },
      {
        title: '收件⽅名称',
        dataIndex: 'receiver_name'
      }
    ]
    return (
      <div>
        <div className='title-container'>
          <h2 className="title-text">产品</h2>
          <Button onClick={this.addProduct} type='primary'>新建产品</Button>
        </div>
        <Table
          className='list-table'
          bordered={true}
          rowKey='id'
          loading={this.state.loading}
          columns={columns}
          pagination={{
            defaultPageSize: 20,
            total: this.state.total,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              this.setState({page}, () => this.getList())
            }
          }}
          dataSource={data}/>
      </div>
    );
  }
}

export default List;
