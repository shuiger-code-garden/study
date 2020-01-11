/**
 *
 * 路由跳转的api
 * @export
 * @class NavigationUtil
 */
export default class NavigationUtil {
  /**
   * 重置回首页
   */
  static goHomePage({params}) {
    let {navigation} = params;
    navigation.navigate('MainRoute');
  }
  /**
   * 返回上一页
   */
  static goBack({params}) {
    let {navigation} = params;
    navigation.goBack();
  }

  /**
   *  跳转到某个页面
   */
  static goPage(page, params) {
    let navigation = NavigationUtil.MainNavigation;
    if (!navigation) {
      console.log('goPage error' + NavigationUtil.MainNavigation);
    }
    navigation.navigate(page, {
      ...params,
    });
  }
}
