import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended', 'plugin:react/jsx-runtime'],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
]);
