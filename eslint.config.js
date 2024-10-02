import typescriptParser from "@typescript-eslint/parser"
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin"
import builderbotPlugin from "eslint-plugin-builderbot"

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      parser: typescriptParser,
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "builderbot": builderbotPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "no-unsafe-optional-chaining": "off",
    },
  },
]
