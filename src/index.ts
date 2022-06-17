import { readFileSync } from 'fs';
import HtmlWebpackPlugin = require('html-webpack-plugin');
import { Compiler } from 'webpack';
// eslint-disable-next-line
// @ts-ignore
import { minifySync } from 'terser-sync';

const pluginName = 'AssetsRetryPlugin';

export interface AssetsRetryOptions {
  maxRetryCount: number;
  onRetry?: RetryFunction;
  onSuccess?: SuccessFunction;
  onFail?: FailFunction;
  domain: Domain;
}
export type RetryFunction = (
  currentUrl: string,
  originalUrl: string,
  retryCollector: null | RetryStatistics
) => string | null;
export interface RetryStatistics {
  retryTimes: number;
  succeeded: string[];
  failed: string[];
}
export type SuccessFunction = (currentUrl: string) => void;
export type FailFunction = (currentUrl: string) => void;
export type Domain = string[] | { [x: string]: string };

export class AssetsRetryPlugin {
  options: AssetsRetryOptions;
  constructor(options: AssetsRetryOptions) {
    this.options = Object.assign(
      {
        domain: [],
        maxRetryCount: 1,
      },
      options
    );
  }

  apply(complier: Compiler) {
    complier.hooks.compilation.tap(
      {
        name: pluginName,
        stage: 1,
      },
      compilation => {
        const hooks = HtmlWebpackPlugin.getHooks(compilation);
        hooks.alterAssetTagGroups.tap(pluginName, assets => {
          assets.headTags.unshift({
            attributes: {},
            tagName: 'script',
            innerHTML: minifySync(`
              if (window.assetsRetry) {
                var assetsRetryStatistics = window.assetsRetry({
                  domain: ${JSON.stringify(this.options.domain)},
                  maxRetryCount: ${this.options.maxRetryCount},
                  onRetry: ${this.options.onRetry?.toString()},
                  onSuccess: ${this.options.onSuccess?.toString()},
                  onFail: ${this.options.onFail?.toString()},
                });
              }
            `).code,
            voidTag: false,
            meta: {
              plugin: pluginName,
            },
          });
          assets.headTags.unshift({
            attributes: {},
            tagName: 'script',
            innerHTML: readFileSync(require.resolve('assets-retry')).toString(),
            voidTag: false,
            meta: {
              plugin: pluginName,
            },
          });
          return assets;
        });
      }
    );
  }
}
