const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  register: '/register',
  login: '/login',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path
