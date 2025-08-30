import { config as baseConfig } from "./base.js";
import reactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  reactHooks.configs["recommended-latest"],
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
