// ============================================================================
// src/leven.js
// 零依赖实现，替代 jest 的 leven 包（编辑距离 / Levenshtein distance）。
// 用途：用户拼错配置项时给出「Did you mean X?」建议。
// ============================================================================

/**
 * 计算两个字符串的 Levenshtein 距离（最小编辑次数：增 / 删 / 改）。
 * 时间复杂度 O(m·n)，对配置键名这种短字符串完全够用。
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function leven(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // prev / curr 滚动数组，避免 O(m·n) 额外空间
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev]; // 换行：curr 变下一轮的 prev
  }
  return prev[n];
}
