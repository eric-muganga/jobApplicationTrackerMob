/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import {name as appName} from './app.json';
import store from './store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootApp = () => (
  <Provider store={store}>
    <GestureHandlerRootView style={{flex: 1}}>
      <App/>
    </GestureHandlerRootView>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootApp);
