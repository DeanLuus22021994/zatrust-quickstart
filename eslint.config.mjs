// Flat ESLint config for ESLint v9+
// Mirrors previous .eslintrc.json rules and integrates Next.js recommendations.
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "unused-imports/no-unused-imports": "error",
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
    ],
  },
];
