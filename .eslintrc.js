 // .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  }
}
