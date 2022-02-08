import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
export const reactPlugin = new ReactPlugin();
export const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
    },
  },
});
appInsights.loadAppInsights();
