// ============================================================================
// src/errors.js
// 基于 jest-validate/src/utils.ts 清洗改写（零依赖版）。
// 出处：jestjs/jest · packages/jest-validate/src/utils.ts（MIT, Meta）
// ============================================================================

import { red, bold, yellow, format, formatPrettyObject } from './format.js';
import { leven } from './leven.js';

const BULLET = bold('●');
export const DEPRECATION = `${BULLET} Deprecation Warning`;
export const ERROR = `${BULLET} Validation Error`;
export const WARNING = `${BULLET} Validation Warning`;

// ----------------------------------------------------------------------------
// 代码质量改进点 ①
// 原实现：constructor 里 `this.name = ''`，反直觉且丢失了错误类名，
// 排查问题时栈/日志里看不到有意义的错误名。
// 改写：保留真实 name，便于日志与栈追踪定位。
// ----------------------------------------------------------------------------
export class ValidationError extends Error {
  constructor(name, message, comment) {
    super(message);
    this.name = name || 'ValidationError';
    comment = comment ? `\n\n${comment}` : '\n';
    this.message = red(`${bold(name)}:\n\n${message}${comment}`);
    // 保留调用栈起点；旧版 Node 无 captureStackTrace 时安全降级。
    Error.captureStackTrace?.(this, ValidationError);
  }
}

export function logValidationWarning(name, message, comment) {
  comment = comment ? `\n\n${comment}` : '\n';
  console.warn(yellow(`${bold(name)}:\n\n${message}${comment}`));
}

// ----------------------------------------------------------------------------
// 代码质量改进点 ②
// 原实现：阈值 `< 3` 硬编码在表达式里，想调参就得改逻辑、易遗漏。
// 改写：抽成命名常量，语义自解释、易调整、易单测边界。
// ----------------------------------------------------------------------------
const MAX_EDIT_DISTANCE = 3;

/** 在允许项里找一个与用户输入「足够接近」的项，用于拼写纠错提示。 */
export function createDidYouMeanMessage(unrecognized, allowedOptions) {
  const suggestion = allowedOptions.find(
    option => leven(option, unrecognized) < MAX_EDIT_DISTANCE,
  );
  return suggestion ? `Did you mean ${bold(format(suggestion))}?` : '';
}
