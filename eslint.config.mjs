import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"
import unusedImports from "eslint-plugin-unused-imports"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // Automatically remove unused imports when ESLint --fix runs
      "unused-imports/no-unused-imports": "error",

      // Report unused variables but allow underscore-prefixed variables
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Prevent namespace imports from React
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'ImportDeclaration[source.value="react"] > ImportNamespaceSpecifier',
          message:
            'Use named React imports, e.g. `import { useEffect, useState } from "react"`.',
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../**", ".."],
              message:
                'Use the "@/" or "@" import alias instead of relative parent imports.',
            },
          ],
        },
      ],
    },
  },

  // Disable ESLint formatting rules that conflict with Prettier
  prettier,
])

export default eslintConfig
