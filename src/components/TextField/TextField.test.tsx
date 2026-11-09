import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextField } from ".";

describe("TextField", () => {
  it("связывает подпись с полем ввода", () => {
    render(<TextField label="Email" />);

    expect(screen.getByLabelText("Email")).toBe(
      screen.getByRole("textbox", { name: "Email" }),
    );
  });

  it("по умолчанию имеет type=text, тип можно переопределить", () => {
    const { rerender } = render(<TextField label="Имя" />);

    expect(screen.getByLabelText("Имя")).toHaveAttribute("type", "text");

    rerender(<TextField label="Пароль" type="password" />);

    expect(screen.getByLabelText("Пароль")).toHaveAttribute("type", "password");
  });

  it("добавляет подсказку в доступное описание", () => {
    render(<TextField label="Email" description="Рабочий адрес" />);

    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Рабочий адрес",
    );
  });

  it("не помечает поле недопустимым, пока нет ошибки", () => {
    render(<TextField label="Email" />);

    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("textbox")).toBeValid();
  });

  it("помечает поле aria-invalid и читает ошибку вместе с подсказкой", () => {
    render(
      <TextField
        label="Email"
        description="Рабочий адрес"
        error="Некорректный адрес"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Рабочий адрес Некорректный адрес",
    );
  });

  it("убирает ошибку из описания, когда она исчезает", () => {
    const { rerender } = render(
      <TextField label="Email" error="Некорректный адрес" />,
    );

    rerender(<TextField label="Email" />);

    const input = screen.getByRole("textbox");

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAccessibleDescription();
  });

  it("объявляет ошибку через вежливую live-область", () => {
    render(<TextField label="Email" error="Некорректный адрес" />);

    expect(screen.getByText("Некорректный адрес")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("передаёт обязательность в атрибут required, а звёздочку скрывает от скринридера", () => {
    render(<TextField label="Email" required />);

    const input = screen.getByRole("textbox", { name: "Email" });

    expect(input).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("сохраняет переданный aria-describedby вместе со своими", () => {
    render(
      <>
        <p id="hint">Внешняя подсказка</p>

        <TextField
          label="Email"
          description="Рабочий адрес"
          aria-describedby="hint"
        />
      </>,
    );

    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Рабочий адрес Внешняя подсказка",
    );
  });

  it("использует переданный id", () => {
    render(<TextField label="Email" id="email-field" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("id", "email-field");
  });

  it("пробрасывает ref и обработчики на поле ввода", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLInputElement>();

    render(<TextField label="Email" ref={ref} onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "a");

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("не принимает ввод, когда disabled", async () => {
    const user = userEvent.setup();

    render(<TextField label="Email" disabled />);

    const input = screen.getByRole("textbox");

    await user.type(input, "abc");

    expect(input).toBeDisabled();
    expect(input).toHaveValue("");
  });
});
