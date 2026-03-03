import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import storybook from "eslint-plugin-storybook";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  ...storybook.configs["flat/recommended"],

  // ✅ import 순서 규칙 추가
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // node 내장 (fs, path)
            "external", // npm 패키지
            "internal", // @/ 절대경로
            "parent", // ../
            "sibling", // ./
            "index", // ./index
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
        },
      ],
    },
  },
]);

export default eslintConfig;
