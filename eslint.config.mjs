import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import { globalIgnores } from 'eslint/config'

const eslintConfig = [
  globalIgnores([
    '.next/**',
    'coverage/**',
    'generated/**',
    'node_modules/**',
    'next-env.d.ts'
  ]),
  ...nextCoreWebVitals,
  ...nextTypescript
]

export default eslintConfig
