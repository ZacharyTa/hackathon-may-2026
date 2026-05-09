import sveltePlugin from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
import globals from 'globals';

export default ts.config(
  { ignores: ['.svelte-kit/', 'build/', '.vercel/'] },
  { files: ['**/*.{ts,svelte}'], languageOptions: { globals: globals.browser } },
  ...ts.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
);
