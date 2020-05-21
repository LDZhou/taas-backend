
export function checkLogin(self) {
  const cookies = document.cookie
  if (cookies.split(';').some((item) => ~item.substring(0, 10).indexOf('token'))) {
    self.props.location.pathname.length <= 1 && self.props.history.push('/app/userList/list')
  } else {
    self.props.history.push('/auth/login')
  }
}

export function signOut(self) {
  window.document.cookie = `token=1;expires=${new Date(0).toGMTString()}`
  window.localStorage.clear()
  self.props.history.push('/auth/login')
}

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
  'undo', 'redo', 'remove-styles', 'separator',
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
  99: '其他'
}

export const EnBrandType = {
  1: 'Commercial brand',
  2: 'Collection and Transportation Company',
  3: 'Packing Station',
  4: 'Granulation Factory',
  5: 'Production Factory',
  6: 'Design Company',
  7: 'Certification Organization',
  8: 'Consulting Company',
  9: 'NGO/NPO',
  10: 'Material Trading Company',
  11: 'Product Trading Company',
  12: 'Storage',
  13: 'Waste Management Company',
  14: 'Logistics Company',
  99: 'Other'
}

export const explain = {
  'TRASHAUS CRM System': 'TRASHAUS管理后台',
  'Welcome': '欢迎你',
  'Administrator': '管理员',
  'Log Out': '退出',
  'App Name': '应用名',
  // User List
  'User List': '用户列表',
  'Users': '用户',
  'User': '用户',
  'User Details': '用户详情',
  'Profile Picture': '头像',
  'Age': '年龄',
  'years': '岁',
  'Name': '姓名',
  'Gender': '性别',
  'Type': '类别',
  'E-mail': '邮箱',
  'Brand Rep.': '品牌负责人',
  'Date of Birth': '生日',
  'Mobile': '手机号',
  'Password': '密码',
  'Registration Time': '注册时间',
  'Browsing History': '浏览记录',
  'Chain Name': '链条名称',
  'Product Name': '产品名称',
  'Browsing Time': '浏览时间',
  'Browsing Location': '浏览地点',
  // Product List
  'Product List': '产品列表',
  'Products': '产品',
  'Product': '产品',
  'Product Details': '产品详情',
  'Brand': '品牌',
  'Brand ID': '品牌ID',
  // 'Name': '名称',
  'Procedure': '步骤分类',
  'Material Loss Ratio': '材料损耗比例',
  'Additive Ratio': '添加物比例',
  'Product Pictures': '产品图片',
  'Model': '型号',
  'Size': '尺寸',
  'Unit Weight': '克重',
  'Quantity': '数量',
  'Material': '材质',
  'Material Ratio': '各使用材料占比',
  'Product Document': '产品文档',
  'Production Time': '生产时间',
  'Shipping Date': '发件日期',
  'Reception Date': '收件日期',
  'Name of the Delivered Good': '运送物品名称',
  'Quantity Delivered': '运送量',
  'Consignor Name': '发件方名称',
  'Consignor Address': '发件方地址',
  'Consignee Name': '收件方名称',
  'Consignee Address': '收件方地址',
  'Logistics Company Name': '物流公司名称',
  'Tracking Number': '物流单号',
  'Delete': '删除',
  'Edit': '编辑',
  // Brand List
  'Brand List': '品牌列表',
  'Brands': '品牌',
  'Brand Details': '品牌详情',
  'Address': '公司地址',
  'Rep. Name': '联系人姓名',
  'Rep. Position': '联系人职位',
  'Rep. Mobile No': '联系人电话',
  'Rep. Email': '联系人邮箱',
  'Rep. User ID': '负责人ID',
  'Province': '省',
  'City': '市',
  'Business License': '营业执照',
  'Relevant Certifications': '相关资质',
  // 'Commercial brand': '商业品牌',
  // 'Collection and Transportation Company': '收运方',
  // 'Packing Station': '打包站',
  // 'Granulation Factory': '造粒厂',
  // 'Production Factory': '制品厂',
  // 'Design Company': '设计公司',
  // 'Certification Organization': '认证机构',
  // 'Consulting Company': '咨询公司',
  // 'Material Trading Company': '材料贸易商',
  // 'Product Trading Company': '制品贸易商',
  // 'Storage': '仓储',
  // 'Waste Management Company': '废弃物管理',
  // 'Logistics Company': '物流公司',
  // 'Other': '其他',

  // Chain List
  'Chain List': '链条列表',
  'Chain Details': '链条详情',
  'Chains': '链条',
  'Chain': '链条',
  'Choosing Products of the Chain': '产品链条',
  'Number of Views': '扫码次数',
  'times': '次',
  'Creation Time': '创建时间',
  'Preview Image': '预览图',
  'Share Image': '二维码分享图',
  '(Recommended width and height 16:25)': '(建议宽高16:25)',
  'QR code': '二维码',
  // form
  ' deleted successfully!': '删除成功！',
  ' created successfully!': '创建成功！',
  ' modified successfully!': '修改成功！',
  'Sure to delete?': '确定删除？',
  'Save': '保存',
  'Login': '登陆',
  'Please enter the ': '请输入',
  'Please select the ': '请选择',
  'Please upload the ': '请上传',
  ' cannot be empty!': '不能为空！'
}