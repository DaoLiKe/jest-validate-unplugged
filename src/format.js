// ============================================================================
// src/format.js
// 零依赖实现，替代 jest 的 pretty-format + chalk。
// 这里只保留「极简上色 + 值格式化」，足以演示错误信息设计。
// 遵循 https://no-color.org ：设置 NO_COLOR=1 可关闭颜色。
// ============================================================================

const useColor = process.env.NO_COLOR === undefined;

// 用 ANSI 转义码包裹字符串；不支持颜色时原样返回。
const wrap = code => s => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);

export const red = wrap(31);
export const green = wrap(32);
export const yellow = wrap(33);
export const bold = wrap(1);

/** 把任意值格式化为可读字符串（函数打印其源码）。 */
export const format = value =>
  typeof value === 'function' ? value.toString() : JSON.stringify(value);

/** 把对象格式化为带缩进的多行字符串（errors.js 用其拼装示例）。 */
export const formatPrettyObject = value => {
  if (typeof value === 'function') return value.toString();
  if (value === undefined) return 'undefined';
  return JSON.stringify(value, null, 2).split('\n').join('\n    ');
};
