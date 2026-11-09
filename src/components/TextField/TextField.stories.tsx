import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../Button";

import { TextField } from ".";

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Email",
    type: "email",
    autoComplete: "email",
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

// Default

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Видимая подпись даёт полю доступное имя.
    const input = canvas.getByRole("textbox", { name: "Email" });

    await userEvent.tab();

    await expect(input).toHaveFocus();

    await userEvent.type(input, "anna@example.com");

    await expect(input).toHaveValue("anna@example.com");
  },
};

// WithDescription

export const WithDescription: Story = {
  args: {
    description: "Мы отправим на этот адрес ссылку для входа.",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("textbox", { name: "Email" }),
    ).toHaveAccessibleDescription(
      "Мы отправим на этот адрес ссылку для входа.",
    );
  },
};

// Required

export const Required: Story = {
  args: {
    required: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Звёздочка скрыта от скринридера, обязательность передаёт атрибут.
    const input = canvas.getByRole("textbox", { name: "Email" });

    await expect(input).toBeRequired();
  },
};

// WithError

export const WithError: Story = {
  args: {
    description: "Мы отправим на этот адрес ссылку для входа.",
    error: "Введите адрес в формате name@example.com.",
    defaultValue: "anna@",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("textbox", { name: "Email" });

    await expect(input).toBeInvalid();
    await expect(input).toHaveAttribute("aria-invalid", "true");

    // Подсказка и ошибка читаются вместе с полем.
    await expect(input).toHaveAccessibleDescription(
      /Мы отправим на этот адрес ссылку для входа\..*Введите адрес в формате/,
    );
  },
};

// Disabled

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "anna@example.com",
  },
};

// Validation

function SubscribeForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (value.trim() === "") {
      setError("Введите email.");
    } else if (!/^\S+@\S+\.\S+$/.test(value)) {
      setError("Введите адрес в формате name@example.com.");
    } else {
      setError("");
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        validate();
      }}
      style={{ display: "grid", gap: 16 }}
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={value}
        error={error}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        onBlur={validate}
      />

      <Button type="submit">Подписаться</Button>
    </form>
  );
}

export const Validation: Story = {
  render: () => <SubscribeForm />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("textbox", { name: "Email" });

    await userEvent.tab();

    await expect(input).toHaveFocus();
    await expect(input).not.toHaveAttribute("aria-invalid");

    // Некорректное значение: ошибка появляется после ухода с поля.
    await userEvent.type(input, "anna@");
    await userEvent.tab();

    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription(
      "Введите адрес в формате name@example.com.",
    );

    // Исправление значения снимает ошибку.
    await userEvent.clear(input);
    await userEvent.type(input, "anna@example.com");
    await userEvent.tab();

    await expect(input).not.toHaveAttribute("aria-invalid");
    await expect(input).not.toHaveAccessibleDescription();
  },
};
