import React, { Component } from 'react';
import {Table, Button} from 'antd'
import { connect } from 'react-redux'

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
    window.send.get('products', {
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
    const { explain, lang } = this.props
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
        title: lang === 'zh_CN' ? '名称' : 'Name',
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
        title: explain['Brand'],
        dataIndex: 'brand_name',
        render: (text, record) => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/brandList/detail/${record.brand_id}`)
            }}>{text}</a>
          </span>
          )
      },
      {
        title: explain['Model'],
        dataIndex: 'model'
      },
      {
        title: explain['Size'],
        dataIndex: 'size',
        width: 80
      },
      {
        title: explain['Quantity'],
        dataIndex: 'quantity'
      },
      {
        title: explain['Material'],
        dataIndex: 'material'
      },
      {
        title: explain['Production Time'],
        dataIndex: 'manufactured_at'
      }
    ]
    return (
      <div>
        <div className='title-container'>
          <h2 className="title-text">{explain['Products']}</h2>
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

function mapStateToProps(state) {
  return {
    lang: state.LangReducer.lang,
    explain: state.ExplainReducer.explain,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
