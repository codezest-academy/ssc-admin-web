// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    globals: globals.browser,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-refresh/only-export-components': 'warn',
    'react-hooks/set-state-in-effect': 'off',
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/\\b(bg|text|border|ring|fill|stroke)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]',
        message:
          '[Theme] Raw Tailwind palette class detected. Use semantic tokens (bg-primary, text-success, bg-muted, text-subject-quant) instead. See docs/frontend-and-ux/theme-system.md.',
      },
      {
        selector: "Literal[value=/\\b(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap|w|h|top|bottom|left|right|inset)-(3|5|7|9|10|11|13|14|15|18|19|20|22|26|28)\\b/]",
        message: "[Theme] Off-grid spacing detected. Use the strict 8pt grid (2, 4, 6, 8, etc.) with 1 (4px) as the only permitted half-step.",
      },
      {
        selector: "Literal[value=/\\b(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap|w|h|top|bottom|left|right|inset)-\\[.*?\\]/]",
        message: "[Theme] Arbitrary spacing values are banned. Use the strict 8pt grid scale.",
      },
      {
        selector: "Literal[value=/\\btext-(lg|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\\b/]",
        message: "[Theme] Banned typography size. Use the Tight Editorial scale (xs, sm, base, xl). text-2xl is allowed ONLY for StatDisplays.",
      },
      {
        selector: "Literal[value=/\\btext-\\[.*?\\]/]",
        message: "[Theme] Arbitrary typography sizes are banned. Use the Tight Editorial scale.",
      }
    ],
  },
}, ...storybook.configs["flat/recommended"]])
