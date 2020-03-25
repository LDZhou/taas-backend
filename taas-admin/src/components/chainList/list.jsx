import React, { Component } from 'react';
import {Table, Button} from 'antd'

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

  addChain = () => {
    this.props.history.push(`/app/chainList/add`)
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
              self.props.history.push(`/app/activeList/detail/${text}`)
            }}>{text}</a>
          </span>
        ),
        width: 90
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/activeList/detail/${record.id}`)
            }}>{text}</a>
          </span>
        ),
        width: 180
      },
      {
        title: '创建⽇期',
        dataIndex: 'created_at'
      }
    ]
    return (
      <div>
        <div className='title-container'>
          <h2 className="title-text">链条</h2>
          <Button onClick={this.addChain} type='primary'>新建链条</Button>
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
