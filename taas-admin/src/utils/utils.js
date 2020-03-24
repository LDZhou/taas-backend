
export function checkLogin(self) {
  // const cookies = document.cookie
  // if (cookies.split(';').some((item) => ~item.indexOf('token'))) {
  //   self.props.location.pathname.length <= 1 && self.props.history.push('/app/userList/list')
  // } else {
  //   self.props.history.push('/auth/login')
  // }
}

// export function signOut(self) {
//   window.document.cookie = `token=1;expires=${new Date(0).toGMTString()}`
//   window.localStorage.clear()
//   self.props.history.push('/auth/login')
// }

  // const controls = [
  //   'undo', 'redo', 'separator',
  //   'font-size', 'line-height', 'letter-spacing', 'separator',
  //   'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  //   'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
  //   'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
  //   'link', 'separator', 'hr', 'separator',
  //   'media', 'separator',
  //   'clear'
  // ]
const controls = [
  'undo', 'redo', 'separator',
  'font-size', 'bold', 'separator',
  'text-align', 'separator',
  'media', 'separator',
  'clear'
]

export const BraftEditorConfig = {
  controls,
  media: {
    // 配置允许插入的外部媒体的类型
    externals: {
      image: true,
      video: false,
      audio: false,
      embed: false
    },
    // 配置允许上传的媒体类型
    accepts: {
      image: true,
      video: false,
      audio: false,
    },
    pasteImage: true
  }
}

export const BrandType = {
  1: '商业品牌',
  2: '收运⽅',
  3: '打包站',
  4: '造粒⼚',
  5: '制品⼚',
  6: '设计公司',
  7: '认证机构',
  8: '咨询公司',
  9: 'NGO/NPO',
  10: '材料贸易商',
  11: '制品贸易商',
  12: '仓储',
  13: '废弃物管理',
  14: '物流公司',
  99: '其他（可以填写）'
}