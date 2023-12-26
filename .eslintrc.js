module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12, // Explicitly set to 2021 or 12 which is essentially the same. This ensures the latest ECMAScript features are supported.
  },
  rules: {
    "no-underscore-dangle": [
      "error",
      {
        allow: ["_id"], // Allowing _id (commonly used in MongoDB)
      },
    ],
    // Any additional custom rules can be added here
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
