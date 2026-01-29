import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const reactPlugin = new ReactPlugin();

const connectionString =
  process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING;

const appInsights = connectionString
  ? new ApplicationInsights({
      config: {
        connectionString,
        enableAutoRouteTracking: true,
        extensions: [reactPlugin],
        extensionConfig: {
          [reactPlugin.identifier]: {},
        },
      },
    })
  : null;

if (appInsights) {
  // Set cloud role name for Application Insights (must be before loadAppInsights)
  appInsights.addTelemetryInitializer((envelope) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, no-param-reassign
    envelope.tags!['ai.cloud.role'] = 'jore4-ui';
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView();
}

export { appInsights, reactPlugin };
