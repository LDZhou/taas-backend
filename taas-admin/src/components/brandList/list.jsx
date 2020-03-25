import React, { Component } from 'react';
import { Table, Button } from 'antd'

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
    window.send.get('products', {
      params: {
        page
      }
    })
    .then(data => {
      this.setState({ data: data.data, total: data.count, loading: false })
    })
  }

  addBrand = () => {
    this.props.history.push(`/app/brandList/add`)
  }

  render() {
    const self = this
    const { data } = this.state
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: text => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/commodityList/detail/${text}`)
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
              self.props.history.push(`/app/commodityList/detail/${record.id}`)
            }}>{text}</a>
          </span>
        ),
        width: 180
      },
      {
        title: '类别',
        dataIndex: 'brand_type'
      },
      {
        title: '公司地址',
        dataIndex: 'address'
      },
      {
        title: '联系⼈姓名',
        dataIndex: 'contact_name'
      },
      {
        title: '联系⼈职位',
        dataIndex: 'contact_title'
      },
      {
        title: '联系⼈电话',
        dataIndex: 'contact_phone'
      },
      {
        title: '联系⼈邮箱',
        dataIndex: 'contact_email'
      },
      {
        title: '注册时间',
        dataIndex: 'created_at'
      }
    ]
    return (
      <div>
        <div className='title-container'>
          <h2 className="title-text">品牌</h2>
          <Button onClick={this.addBrand} type='primary'>新建品牌</Button>
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
