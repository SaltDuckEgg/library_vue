import Layout from '@/layout'

const tableRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/detail',
  name: 'User',
  meta: {
    title: '用户信息',
    icon: 'user'
  },
  children: [
    {
      path: 'detail',
      component: () => import('@/views/user/detail'),
      name: 'Detail',
      meta: { title: '个人中心' }
    }
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // },
    // {
    //   path: 'complex-table',
    //   component: () => import('@/views/table/complex-table'),
    //   name: 'ComplexTable',
    //   meta: { title: 'Complex Table' }
    // }
  ]
}
export default tableRouter
