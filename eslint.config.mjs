// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettierFlat from 'eslint-config-prettier/flat'

export default tseslint.config(
    eslint.configs.recommended,
    eslintConfigPrettierFlat,
    tseslint.configs.strict
)
