import { defineConfig } from "windicss/helpers";

export default defineConfig({
  // preflight: false,
  plugins: [
    require("@windicss/plugin-heropatterns")({
      // the list of patterns you want to generate a class for
      // the names must be in kebab-case
      // an empty array will generate all 87 patterns
      patterns: ["temple"],

      // The foreground colors of the pattern
      colors: {
        default: "#9C92AC",
        "blue-dark": "#000044", // also works with rgb(0,0,205)
      },

      // The foreground opacity
      opacity: {
        default: "0.4",
        100: "1.0",
      },
    }),
  ],
});
