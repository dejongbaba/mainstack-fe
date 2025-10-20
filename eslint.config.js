import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  },
];
