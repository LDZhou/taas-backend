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
    window.send.get('chains', {
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
    const { explain, lang, userInfo } = this.props
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: text => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/chainList/detail/${text}`)
            }}>{text}</a>
          </span>
        ),
        width: 90
      },
      {
        title: lang === 'zh_CN' ? '名称' : 'Name',
        dataIndex: 'name',
        render: (text, record) => (
          <span>
            <a onClick={(e) => {
              e.preventDefault()
              self.props.history.push(`/app/chainList/detail/${record.id}`)
            }}>{text}</a>
          </span>
        ),
        width: 360
      },
      // {
      //   title: 'App Id',
      //   dataIndex: 'app_id',
      //   width: 90
      // },
      {
        title: lang === 'zh_CN' ? '应用名' : 'App Name',
        dataIndex: 'app_name',
        width: 200
      },
      {
        title: explain['Creation Time'],
        dataIndex: 'created_at'
      }
    ]
    return (
      <div>
        <div className='title-container'>
          <h2 className="title-text">{explain['Chains']}</h2>
          {userInfo && !userInfo.brand && <Button onClick={this.addChain} type='primary'>{lang === 'zh_CN' ? '新建链条' : 'New'}</Button>}
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
    userInfo: state.UserInfoReducer.userInfo,
    lang: state.LangReducer.lang,
    explain: state.ExplainReducer.explain,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)

