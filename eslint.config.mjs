import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      'playwright/.auth/**',
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React 19's compiler-oriented rule is too strict for local UI hydration
      // patterns used here, such as restoring form drafts from sessionStorage or
      // syncing controlled combobox labels after a selected record changes.
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Marketing/modal copy often contains plain apostrophes; keep this as a
      // formatting concern rather than a blocking lint error.
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default eslintConfig
