// ============================================================================
// examples/usage.js
// 零依赖可运行演示：node examples/usage.js
// （设置 NO_COLOR=1 可关闭颜色）
// ============================================================================
import {
  validate,
  errorMessage,
  ValidationError,
  createDidYouMeanMessage,
} from '../src/index.js';

// 示例/默认配置：提供「允许的键」和「示例值（用于推导类型 & 拼装错误示例）」
const exampleConfig = {
  maxWorkers: 1,
  testEnvironment: 'node',
  verbose: true,
};

const options = {
  exampleConfig,
  recursive: true,
  // condition：当前值类型需与示例值一致
  condition: (value, example) => typeof value === typeof example,
  // error：类型不符时抛出友好错误（直接复用 jest 同款 errorMessage）
  error: errorMessage,
  // unknown：遇到未知（拼写错误）键时给出「Did you mean?」建议
  unknown: (config, exampleConfig, key) => {
    const allowed = Object.keys(exampleConfig);
    const hint = createDidYouMeanMessage(key, allowed);
    console.warn(`⚠️  Unknown option "${key}". ${hint}`);
  },
};

function run(label, config) {
  console.log(`\n=== ${label} ===`);
  try {
    const result = validate(config, options);
    console.log('result:', result);
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log(err.message);
    } else {
      throw err;
    }
  }
}

run('合法配置', { maxWorkers: 4, testEnvironment: 'node', verbose: false });
run('拼写错误的键 (verboose)', {
  maxWorkers: 4,
  testEnvironment: 'node',
  verboose: true,
});
run('maxWorkers 类型错误', {
  maxWorkers: true,
  testEnvironment: 'node',
  verbose: false,
});
