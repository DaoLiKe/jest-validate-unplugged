// ============================================================================
// src/messages.js
// 基于 jest-validate/src/errors.ts 清洗改写（零依赖版）。
// 出处：jestjs/jest · packages/jest-validate/src/errors.ts（MIT, Meta）
// 职责：拼装「类型不符」时的友好错误文案。
// ============================================================================

import { getType } from './getType.js';
import { bold, red, green, formatPrettyObject } from './format.js';
import { ERROR, ValidationError } from './errors.js';

/**
 * 根据示例值推导「允许的类型」。
 * 原 jest 用 condition.ts 描述「允许的值/类型」；这里简化为直接用示例值本身。
 * @param {*} defaultValue
 * @returns {Array<*>}
 */
function getExampleValues(defaultValue) {
  return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
}

/**
 * 当某个配置项类型不符时，抛出带示例的 ValidationError。
 * 调用约定与 jest 一致：error(option, received, defaultValue, options, path)
 *
 * @param {string} option      出错的键名
 * @param {*} received         用户实际传入的值
 * @param {*} defaultValue     示例/默认配置里该键的值（用于推导允许类型 & 拼示例）
 * @param {object} options     校验选项（含 comment / title）
 * @param {string[]} [path]    嵌套路径，用于定位 `a.b.c` 形式的键
 */
export function errorMessage(option, received, defaultValue, options, path = []) {
  const examples = getExampleValues(defaultValue);
  const validTypes = [...new Set(examples.map(getType))];

  const location = path.length > 0 ? `${path.join('.')}.` : '';
  const message =
    `  Option ${bold(`"${location}${option}"`)} must be of type:\n` +
    `    ${validTypes.map(t => green(t)).join(' or ')}\n` +
    `  but instead received:\n` +
    `    ${red(getType(received))}\n\n` +
    `  Example:\n${formatExamples(option, examples)}`;

  const comment = options.comment;
  const name = (options.title && options.title.error) || ERROR;

  throw new ValidationError(name, message, comment);
}

function formatExamples(option, examples) {
  return examples
    .map(
      e =>
        `  {\n    ${bold(`"${option}"`)}: ${bold(formatPrettyObject(e))}\n  }`,
    )
    .join('\n\n  or\n\n');
}
