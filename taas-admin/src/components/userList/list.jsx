import React, { Component } from 'react';
import {Table} from 'antd'

class List extends Component {
  state={
    total: 0,
    page: 1,
    loading: false,
    data: [
    ]
  }
  componentDidMount () {
    this.getList()
  }

  getList = () => {
    const { page } = this.state
    this.setState({ loading: true })
    window.send.get('users', {
      params: {
        page
      }
    })
    .then(data => {
      this.setState({ data: data.data, total: data.count, loading: false })
    })
  }

  viewDetail = (id) => {
    this.props.history.push(`/app/userList/detail/${id}`)
  }

  render () {
    const self = this
    const { data } = this.state
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: (text, record) => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.viewDetail(text)
            }}>{text}</a>
          </span>
        )
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
        render: (text, record) => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.viewDetail(record.id)
            }}>{text}</a>
          </span>
        ),
        width: 180
      },
      {
        title: '性别',
        dataIndex: 'gender',
        render (text) {
          return ['男', '女'][text]
        }
      },
      {
        title: '年龄',
        dataIndex: 'age'
      },
      {
        title: '⽣⽇',
        dataIndex: 'date_of_birth'
      },
      {
        title: '⼿机号',
        dataIndex: 'phone'
      },
      {
        title: '注册⽇期',
        dataIndex: 'created_at'
      }
    ]
    return (
      <div>
        <div className='title-container'>
          <h2 className="title-text">用户</h2>
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
