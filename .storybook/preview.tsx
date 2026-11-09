import type { Preview } from "@storybook/react-vite";

// Глобальные стили и токены: шрифт, цвета, фокус-кольцо.
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'error' — нарушения доступности валят тесты и CI
      test: "error",
    },
    options: {
      storySort: {
        order: ["Введение", "Components", "*"],
      },
    },
  },
};

export default preview;
