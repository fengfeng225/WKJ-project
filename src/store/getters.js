const getters = {
  token: state => state.user.token,
  menuList: state => state.user.menuList,
  userInfo: state => state.user.userInfo,
  permissionList: state => state.user.permissionList,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes
}
export default getters
