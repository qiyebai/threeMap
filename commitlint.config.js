module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', // 新功能
      'fix', // 修复 bug
      'improve', // 提升优化
      'pref', // 新能相关
      'docs', // 文档相关
      'styles', // 样式相关
      'refactor', // 重构
      'test', // 测试相关
      'build', // 项目框架本身相关
      'revert', // 回退
      'other', // 其他改动
    ]],
  },
};
