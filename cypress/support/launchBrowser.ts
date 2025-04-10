/* eslint-disable no-console */

// Original code from: https://www.cypress.io/blog/generate-high-resolution-videos-and-screenshots

// let's increase the browser window size when running headlessly
// this will produce higher resolution images and videos
// https://on.cypress.io/browser-launch-api

/**
 * The browser width and height we want to get our screenshots and videos
 * will be of that resolution. + Normal launch options
 *
 * @param width
 * @param height
 * @param browser
 * @param launchOptions
 */
function setHeadlessBrowserScreenSizeLaunchOptions(
  width: number,
  height: number,
  browser: Cypress.Browser,
  launchOptions: Cypress.BeforeBrowserLaunchOptions,
): Cypress.BeforeBrowserLaunchOptions {
  console.log('Setting the browser window size to %d x %d', width, height);

  if (browser.name === 'chrome') {
    return {
      ...launchOptions,
      args: launchOptions.args.concat(
        `--window-size=${width},${height}`,
        // force screen to be non-retina and just use our given resolution
        '--force-device-scale-factor=1',
      ),
    };
  }

  if (browser.name === 'electron') {
    return {
      ...launchOptions,
      preferences: {
        ...launchOptions.preferences,
        // might not work on CI for some reason
        width,
        height,
      },
    };
  }

  if (browser.name === 'firefox') {
    return {
      ...launchOptions,
      args: launchOptions.args.concat(`--width=${width}`, `--height=${height}`),
    };
  }

  return launchOptions;
}

function applyScreenSizeOptions(
  browser: Cypress.Browser,
  launchOptions: Cypress.BeforeBrowserLaunchOptions,
): Cypress.BeforeBrowserLaunchOptions {
  console.log(
    'Launching browser %s | is headless? %s',
    browser.name,
    browser.isHeadless,
  );

  if (!browser.isHeadless) {
    console.log('Not headless - Launching with default screen size options!');
    return launchOptions;
  }

  const rawWidth = process.env.CYPRESS_SCREEN_WIDTH;
  const rawHeight = process.env.CYPRESS_SCREEN_HEIGHT;
  const width = Number(rawWidth);
  const height = Number(rawHeight);

  if (Number.isInteger(width) && Number.isInteger(height)) {
    console.log(
      'Headless - Found proper width and height - Launching with custom size!',
    );
    return setHeadlessBrowserScreenSizeLaunchOptions(
      width,
      height,
      browser,
      launchOptions,
    );
  }

  if (rawWidth || rawHeight) {
    throw new Error(
      `Cannot launch headless browser! Found invalid screen size env variables: CYPRESS_SCREEN_WIDTH=${rawWidth} | CYPRESS_SCREEN_HEIGHT=${rawHeight}`,
    );
  }

  console.log('Headless - Launching with default screen size options!');
  return launchOptions;
}

// Set the browser into reduced motion mode.
// Prevents flakyness in map tests by disabling map panning/zooming animations.
function applyReducedMotionOptions(
  browser: Cypress.Browser,
  launchOptions: Cypress.BeforeBrowserLaunchOptions,
): Cypress.BeforeBrowserLaunchOptions {
  if (browser.name === 'chrome') {
    return {
      ...launchOptions,
      args: launchOptions.args.concat('--force-prefers-reduced-motion'),
    };
  }

  if (browser.name === 'firefox') {
    return {
      ...launchOptions,
      preferences: {
        ...launchOptions.preferences,
        'ui.prefersReducedMotion': 1,
      },
    };
  }

  return launchOptions;
}

export function onLaunchBrowser(
  browser: Cypress.Browser,
  launchOptions: Cypress.BeforeBrowserLaunchOptions,
): Cypress.BeforeBrowserLaunchOptions {
  const withScreenSize = applyScreenSizeOptions(browser, launchOptions);
  const withReducedMotion = applyReducedMotionOptions(browser, withScreenSize);

  return withReducedMotion;
}

export function registerBrowserLaunchHook() {
  console.log('Registering custom browser launcher hook!');
}
