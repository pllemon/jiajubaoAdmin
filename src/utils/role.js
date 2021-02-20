// 根据角色配置路由
import Layout from '@/layout'

export const mainAdminRoutes = [
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: { title: '线上订单管理', icon: 'affiliations_li' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/order/list'),
        meta: { title: '线上订单', icon: 'affiliations_li' }
      }
    ]
  },

  {
    path: '/offline',
    component: Layout,
    redirect: '/offline/list',
    name: 'Offline',
    meta: { title: '线下订单管理', icon: 'exchange' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/offline/list'),
        meta: { title: '线下订单', icon: 'exchange', menu: '3-1' }
      }
    ]
  },
  
  {
    path: '/master',
    component: Layout,
    redirect: '/master/list',
    name: 'Master',
    meta: { title: '师傅管理', icon: 'namecard' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/master/list'),
        meta: { title: '全部师傅', menu: '2-2'}
      },
      {
        path: 'settlement',
        name: 'Settlement',
        component: () => import('@/views/master/settlement'),
        meta: { title: '师傅申款记录', menu: '4-1'}
      }
    ]
  },

  {
    path: '/shopowner',
    component: Layout,
    redirect: '/shopowner/list',
    name: 'Shopowner',
    meta: { title: '店长管理', icon: 'namecard' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/shopowner/list'),
        meta: { title: '全部店长', menu: '2-3'}
      }
    ]
  },

  {
    path: '/attendant',
    component: Layout,
    redirect: '/attendant/list',
    name: 'Attendant',
    meta: { title: '客服管理', icon: 'namecard' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/attendant/list'),
        meta: { title: '全部客服', menu: '2-4'}
      }
    ]
  },

  
  {
    path: '/salesman',
    component: Layout,
    redirect: '/salesman/list',
    name: 'Salesman',
    meta: { title: '业务管理', icon: 'namecard' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/salesman/list'),
        meta: { title: '全部业务', menu: '2-6'}
      }
    ]
  },


  {
    path: '/businessman',
    component: Layout,
    redirect: '/businessman/list',
    name: 'Businessman',
    meta: { title: '商家管理', icon: 'boss' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/businessman/list'),
        meta: { title: '全部商家', menu: '3-2'}
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/businessman/goodsList'),
        meta: { title: '全部商品', menu: '3-3'}
      }
    ]
  },

  {
    path: '/member',
    component: Layout,
    redirect: '/member/list',
    name: 'Member',
    meta: { title: '用户管理', icon: 'group' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/member/list'),
        meta: { title: '用户列表', menu: '2-1'}
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('@/views/member/feedback'),
        meta: { title: '用户反馈', menu: '1-21' }
      },
      {
        path: 'settlement',
        name: 'Settlement',
        component: () => import('@/views/member/settlement'),
        meta: { title: '提现申请', menu: '4-5' }
      }
    ]
  },

  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/income',
    name: 'Finance',
    meta: { title: '财务管理', icon: 'coinpurse_line' },
    children: [
      {
        path: 'income',
        name: 'Income',
        component: () => import('@/views/finance/income'),
        meta: { title: '收入流水', menu: '4-2'}
      },
      {
        path: 'income2',
        name: 'Income2',
        component: () => import('@/views/finance/income/index2'),
        meta: { title: '收入流水', menu: '4-21'}
      },
      {
        path: 'expend',
        name: 'Expend',
        component: () => import('@/views/finance/expend'),
        meta: { title: '支出流水', menu: '4-3' }
      },
      {
        path: 'networkMonthlyStatistics',
        name: 'NetworkMonthlyStatistics',
        component: () => import('@/views/finance/networkMonthlyStatistics'),
        meta: { title: '网点月统计', menu: '4-6' }
      },
      {
        path: 'masterMonthlyStatistics',
        name: 'MasterMonthlyStatistics',
        component: () => import('@/views/finance/masterMonthlyStatistics'),
        meta: { title: '师傅月统计', menu: '4-7' }
      }
    ]
  },

  {
    path: '/show',
    component: Layout,
    redirect: '/show/list',
    name: 'Show',
    meta: { title: '施工广场', icon: 'certificate_fil', menu: '2-5' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/show/list'),
        meta: { title: '施工广场', icon: 'certificate_fil', menu: '2-5' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/advert',
    name: 'System',
    meta: { title: '小程序设置', icon: 'setting' },
    children: [
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/system/category/list'),
        meta: { title: '类目管理', menu: '5-9' }
      },
      {
        path: 'advert',
        name: 'Advert',
        component: () => import('@/views/system/advert/list'),
        meta: { title: '广告管理', menu: '5-1' }
      },
      {
        path: 'regulations',
        name: 'Regulations',
        component: () => import('@/views/system/regulations'),
        meta: { title: '用户须知', menu: '5-11' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/system/about'),
        meta: { title: '企业文化', menu: '5-2' }
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/system/notice/list'),
        meta: { title: '系统公告', menu: '1-20' }
      },
      {
        path: 'notice/update',
        name: 'NoticeUpdate',
        component: () => import('@/views/system/notice/update'),
        meta: { title: '系统公告详情', menu: '1-20' }
      },
      {
        path: 'concat',
        name: 'Concat',
        component: () => import('@/views/system/concat'),
        meta: { title: '使用说明', menu: '5-3' }
      },
      {
        path: 'userAgreement',
        name: 'userAgreement',
        component: () => import('@/views/system/userAgreement'),
        meta: { title: '用户协议', menu: '5-4' }
      },
      {
        path: 'masterAgreement',
        name: 'masterAgreement',
        component: () => import('@/views/system/masterAgreement'),
        meta: { title: '师傅协议', menu: '5-5' }
      },
      {
        path: 'businessAgreement',
        name: 'businessAgreement',
        component: () => import('@/views/system/businessAgreement'),
        meta: { title: '商家协议', menu: '5-6' }
      }
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/network',
    name: 'Setting',
    meta: { title: '后台设置', icon: 'cloud_history' },
    children: [
      {
        path: 'network',
        name: 'Network',
        component: () => import('@/views/setting/network/list'),
        meta: { title: '网点设置', menu: '5-7' }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/setting/account/list'),
        meta: { title: '账号管理', menu: '5-8' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export const branchAdminRoutes = [
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: { title: '线上订单管理', icon: 'form' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/order/list'),
        meta: { title: '全部订单', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]


export const testAdminRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/advert',
    name: 'System',
    meta: { title: '小程序设置', icon: 'form' },
    children: [
      {
        path: 'advert',
        name: 'Advert',
        component: () => import('@/views/system/advert/list'),
        meta: { title: '首页广告' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/system/about'),
        meta: { title: '企业文化' }
      },
      {
        path: 'concat',
        name: 'Concat',
        component: () => import('@/views/system/concat'),
        meta: { title: '使用说明' }
      },
      {
        path: 'userAgreement',
        name: 'userAgreement',
        component: () => import('@/views/system/userAgreement'),
        meta: { title: '用户协议' }
      },
      {
        path: 'masterAgreement',
        name: 'masterAgreement',
        component: () => import('@/views/system/masterAgreement'),
        meta: { title: '师傅协议' }
      },
      {
        path: 'businessAgreement',
        name: 'businessAgreement',
        component: () => import('@/views/system/businessAgreement'),
        meta: { title: '商家协议' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/network',
    name: 'Setting',
    meta: { title: '后台设置', icon: 'form' },
    children: [
      {
        path: 'network',
        name: 'Network',
        component: () => import('@/views/setting/network/list'),
        meta: { title: '网点设置' }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/setting/account/list'),
        meta: { title: '账号管理' }
      }
    ]
  },
  
  { path: '*', redirect: '/404', hidden: true }
]