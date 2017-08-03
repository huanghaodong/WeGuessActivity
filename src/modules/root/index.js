//navigator

import React, {
  Component
} from 'react';
import {
  Navigator
} from 'react-native-deprecated-custom-components';
import WeGuessActivityList from '../../modules/WeGuessActivityList';

export default class Root extends Component {
  //渲染场景
  renderScene(route, navigator) {
      return <route.component navigator={navigator} {...route.data}/>;
    }
    //场景动画
  configureScene(route, routeStack) {
    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {
    return (
      <Navigator 
          renderScene = {this.renderScene}
          configureScene = {this.configureScene}
          initialRoute = {{component:WeGuessActivityList}}
      />
    )
  }

}
