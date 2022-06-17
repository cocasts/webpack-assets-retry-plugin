# @cocasts/webpack-assets-retry-plugin

A webpack plugin to retry load assets based on https://github.com/Nikaple/assets-retry.

<img width="827" alt="screenshot 2022-06-18 at 00 47 39" src="https://user-images.githubusercontent.com/37169906/174351359-72ae0089-51c4-41d6-a910-43f68a1dcb8e.png">

## Installation

### Install with npm
```bash
$ npm install @cocasts/webpack-assets-retry-plugin
```

## Usage

```javascript
// webpack.config.js
const { AssetsRetryPlugin } = require('@cocasts/webpack-assets-retry-plugin');

plugins: [
  new AssetsRetryPlugin({
    // domain list, only resources in the domain list will be retried.
    domain: ['localhost:3000/', 'localhost:3000/fallback/'],
    // maximum retry count for each asset, default is 3
    maxRetryCount: 3,
    // onRetry hook is how you can customize retry logic with, default is x => x
    onRetry: function(currentUrl, originalUrl, statistics) {
      return currentUrl
    },
    // for a given resource (except background-images in css),
    // either onSuccess or onFail will be eventually called to
    // indicate whether the resource has been successfully loaded
    onSuccess: function(currentUrl) {
      console.log(currentUrl, assetsRetryStatistics[currentUrl])
    },
    onFail: function(currentUrl) {
      console.log(currentUrl, assetsRetryStatistics[currentUrl])
    }
  }),
];
```

## Requirements

- webpack >= 5.0.0
- html-webpack-plugin >=4.0.0

## Principle

- Reference: [Nikaple/assets-retry](https://github.com/Nikaple/assets-retry/blob/master/README-cn.md#%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)

## License

MIT
