const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  id: state => state.user.id,
  token: state => state.user.token,
  name: state => state.user.name,
  sex: state => state.user.sex,
  username: state => state.user.username,
  password: state => state.user.password,
  phone: state => state.user.phone,
  email: state => state.user.email,
  academy: state => state.user.academy,
  class_num: state => state.user.class_num,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
