// ============================================================================
// src/validate.js
// 基于 jest-validate/src/validate.ts 清洗改写（零依赖版）。
// 出处：jestjs/jest · packages/jest-validate/src/validate.ts（MIT, Meta）
// ============================================================================

import { ValidationError } from './errors.js';

// ----------------------------------------------------------------------------
// 代码质量改进点 ③
// 原实现：allowsMultipleTypes(key) 内硬编码 `key === 'maxWorkers'` 特例，
// 散落在主校验流程里，难以发现与扩展。
// 改写：把「允许多类型的键」集中为显式白名单，一眼可见、易扩展。
// ----------------------------------------------------------------------------
const MULTI_TYPE_KEYS = new Set(['maxWorkers']);

function isStringOrNumber(value) {
  const t = typeof value;
  return t === 'string' || t === 'number';
}

function shouldSkip(path, key, denylist) {
  return denylist ? denylist.includes([...path, key].join('.')) : false;
}

/**
 * 递归校验配置对象（内部函数）。
 *
 * @param {object} config        用户配置
 * @param {object} exampleConfig 示例/默认配置（提供允许键与类型）
 * @param {object} options       校验选项（condition / error / unknown / deprecate 等回调）
 * @param {string[]} path        当前路径（用于嵌套键定位）
 * @param {{hasDeprecation: boolean}} warnings 局部收集器（不再用模块级变量）
 */
function validateRecursive(config, exampleConfig, options, path, warnings) {
  if (
    typeof config !== 'object' ||
    config == null ||
    typeof exampleConfig !== 'object' ||
    exampleConfig == null
  ) {
    return;
  }

  for (const key of Object.keys(config)) {
    if (
      options.deprecatedConfig &&
      key in options.deprecatedConfig &&
      typeof options.deprecate === 'function'
    ) {
      const isDeprecated = options.deprecate(
        config,
        key,
        options.deprecatedConfig,
        options,
      );
      warnings.hasDeprecation = warnings.hasDeprecation || isDeprecated;
    } else if (MULTI_TYPE_KEYS.has(key)) {
      const value = config[key];
      if (key === 'maxWorkers' && !isStringOrNumber(value)) {
        throw new ValidationError(
          'Validation Error',
          `${key} has to be of type string or number`,
          'maxWorkers=50% or\nmaxWorkers=3',
        );
      }
    } else if (Object.prototype.hasOwnProperty.call(exampleConfig, key)) {
      if (
        typeof options.condition === 'function' &&
        typeof options.error === 'function' &&
        !options.condition(config[key], exampleConfig[key])
      ) {
        options.error(key, config[key], exampleConfig[key], options, path);
      }
    } else if (shouldSkip(path, key, options.recursiveDenylist)) {
      // 跳过黑名单路径下的未知项
    } else {
      options.unknown?.(config, exampleConfig, key, options, path);
    }

    if (
      options.recursive &&
      !Array.isArray(exampleConfig[key]) &&
      options.recursiveDenylist &&
      !shouldSkip(path, key, options.recursiveDenylist)
    ) {
      validateRecursive(
        config[key],
        exampleConfig[key],
        options,
        [...path, key],
        warnings,
      );
    }
  }
}

// ----------------------------------------------------------------------------
// 对外主入口（对应 jest 的 validate）
// ----------------------------------------------------------------------------
export function validate(config, options) {
  // 改进点 ④：原实现用「模块级可变变量 hasDeprecationWarnings」跨调用共享状态，
  // 在并发或重入场景下会串味（上一个调用的结果污染下一个）。
  // 改写：改为局部对象收集，函数保持纯净、无副作用。
  const warnings = { hasDeprecation: false };

  const mergedOptions = {
    ...options,
    recursiveDenylist: [...(options.recursiveDenylist || [])],
    title: options.title || 'Validation Error',
  };

  validateRecursive(
    config,
    options.exampleConfig,
    mergedOptions,
    [],
    warnings,
  );

  // 注：原 jest 这里恒返回 isValid: true（死字段，见 STUDY_GUIDE.md 讨论）。
  // 我们保留接口形状以便对照，但明确标注其为历史包袱。
  return {
    hasDeprecationWarnings: warnings.hasDeprecation,
    isValid: true,
  };
}
