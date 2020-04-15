import React, { Component } from 'react';
import { Table, Button } from 'antd'
import { BrandType } from '../../utils/utils'
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
    window.send.get('brands', {
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
    const { explain, lang } = this.props
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: text => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/brandList/detail/${text}`)
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
              self.props.history.push(`/app/brandList/detail/${record.id}`)
            }}>{text}</a>
          </span>
        ),
        width: 180
      },
      {
        title: explain['Type'],
        dataIndex: 'brand_type',
        render: text => BrandType[text],
        width: 90
      },
      {
        title: explain['Address'],
        dataIndex: 'address'
      },
      {
        title: explain['Rep. Name'],
        dataIndex: 'contact_name',
        width: 110
      },
      {
        title: explain['Rep. Position'],
        dataIndex: 'contact_title',
        width: 130
      },
      {
        title: explain['Rep. Mobile No'],
        dataIndex: 'contact_phone',
        width: 150
      },
      {
        title: explain['Rep. Email'],
        dataIndex: 'contact_email',
        width: 180
      },
      {
        title: explain['Registration Time'],
        dataIndex: 'created_at',
        width: 160
      }
    ]
    return (
      <div>
        <div className='title-container'>
          <h2 className="title-text">{explain['Brands']}</h2>
          <Button onClick={this.addBrand} type='primary'>{lang === 'zh_CN' ? '新建品牌' : 'New'}</Button>
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
