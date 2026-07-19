// ============================================================================
// src/getType.js
// 零依赖实现，替代 jest 的 @jest/get-type 包。
// 目的：去掉外部依赖，使整个 study 模块无需 npm install 即可运行 / 单测。
// ============================================================================

/**
 * 返回值的类型名（扩展 typeof，能区分 null / array / nan）。
 * @param {*} value
 * @returns {string}
 */
export function getType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number' && Number.isNaN(value)) return 'nan';
  return typeof value; // 'string' | 'number' | 'boolean' | 'object' | 'function' | 'bigint' | 'symbol'
}
