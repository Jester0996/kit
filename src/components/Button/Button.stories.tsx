import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from ".";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// Primary

const primaryOnClick = fn();

export const Primary: Story = {
  args: {
    children: "Сохранить",
    variant: "primary",
    size: "md",
    onClick: primaryOnClick,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button", {
      name: "Сохранить",
    });

    // Перемещаем фокус на кнопку.
    await userEvent.tab();

    await expect(button).toHaveFocus();

    // Проверяем активацию клавишей Enter.
    await userEvent.keyboard("{Enter}");

    // Проверяем активацию клавишей Space.
    await userEvent.keyboard(" ");

    await expect(primaryOnClick).toHaveBeenCalledTimes(2);
  },
};

// Secondary

export const Secondary: Story = {
  args: {
    children: "Отмена",
    variant: "secondary",
    size: "md",
  },
};

// Outline

export const Outline: Story = {
  args: {
    children: "Подробнее",
    variant: "outline",
    size: "md",
  },
};

// Danger

export const Danger: Story = {
  args: {
    children: "Удалить",
    variant: "danger",
    size: "md",
  },
};

// Small

export const Small: Story = {
  args: {
    children: "Маленькая кнопка",
    size: "sm",
  },
};

// Large

export const Large: Story = {
  args: {
    children: "Большая кнопка",
    size: "lg",
  },
};

// Disabled

export const Disabled: Story = {
  args: {
    children: "Недоступно",
    disabled: true,
  },
};

// AriaDisabled

const ariaDisabledOnClick = fn();

export const AriaDisabled: Story = {
  args: {
    children: "Недоступно, но в фокусе",
    "aria-disabled": true,
    onClick: ariaDisabledOnClick,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button", {
      name: "Недоступно, но в фокусе",
    });

    // В отличие от disabled, кнопка остаётся в порядке фокуса.
    await userEvent.tab();

    await expect(button).toHaveFocus();
    await expect(button).not.toBeDisabled();
    await expect(button).toHaveAttribute("aria-disabled", "true");

    // Проверяем, что нажатия не вызывают обработчик.
    await userEvent.keyboard("{Enter}");
    await userEvent.click(button);

    await expect(ariaDisabledOnClick).not.toHaveBeenCalled();
  },
};

// Loading

const loadingOnClick = fn();

export const Loading: Story = {
  args: {
    children: "Сохранение...",
    isLoading: true,
    onClick: loadingOnClick,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button", {
      name: "Сохранение...",
    });

    // Проверяем, что загружающаяся кнопка остаётся фокусируемой.
    await userEvent.tab();

    await expect(button).toHaveFocus();

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toHaveAttribute("aria-disabled", "true");

    // Проверяем блокировку клавиатурной активации.
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    await expect(loadingOnClick).not.toHaveBeenCalled();
  },
};
