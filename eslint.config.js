//import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { 
      globals: pluginJest.environments.globals.globals 
    },
    env: {
      node: true, // ✅ добавлено
    },    
    plugins: { jest: pluginJest },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'no-console': 'off',
      "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                "message": "Unexpected property on console object was called"
            }
      ]      
    }
  },
  pluginJs.configs.recommended,
];