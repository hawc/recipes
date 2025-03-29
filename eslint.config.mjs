import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";


const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  globalIgnores(["**/*generated*"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "@stylistic": stylistic, 
    },
    ignores: ["*generated*"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, 
      },
    }, 
  },
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // pluginJs.configs.recommended,
  ...compat.config({
    extends: ["next"], 
  }),
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      quotes: ["error", "double", "avoid-escape"],
      "import/no-anonymous-default-export": "off",
      semi: ["error", "always"],
      "no-multiple-empty-lines": ["error", {
        "max": 1, 
      }],
      "@stylistic/indent": ["error", 2],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/object-curly-newline": ["error", {
        "ImportDeclaration": {
          "multiline": true,
          minProperties: 2,
        },
        "ObjectPattern": {
          "multiline": true,
          minProperties: 1, 
        },
      }],
      "comma-dangle": ["error", "always-multiline"],
      "@stylistic/object-property-newline": "error",
      "@stylistic/template-curly-spacing": "error",
      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: "return", 
        },
      ],
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": ["error", { 
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always", 
      }],
      "@stylistic/keyword-spacing": ["error", { "before": true }],
    },
  },
  // {
  //   files: ["**/*.{graphql,gql}"],
  //   plugins: {
  //     "@graphql-eslint": graphqlPlugin,
  //   },
  //   languageOptions: {
  //     parser: graphqlPlugin.parser,
  //     parserOptions: {
  //       graphQLConfig: {
  //         schema: "./src/schema/base/schema.graphql",
  //       },
  //     },
  //   },
  // },
  // {
  //   // Setup recommended config for schema files
  //   files: ["**/*schema.{graphql,gql}"],
  //   rules: graphqlPlugin.configs["flat/schema-recommended"].rules,
  // },
  // {
  //   // Setup recommended config for operations files
  //   files: ["**/*operations.{graphql,gql}"],
  //   rules: graphqlPlugin.configs["flat/operations-recommended"].rules,
  // },
);