import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { TooltipProvider } from "./components/Tooltip";

function renderApp() {
  return render(
    <TooltipProvider delayDuration={0}>
      <App />
    </TooltipProvider>,
  );
}

describe("App", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("содержит ссылку для пропуска навигации, заголовок и разделы демо", () => {
    renderApp();

    expect(
      screen.getByRole("link", { name: "Перейти к основному содержимому" }),
    ).toHaveAttribute("href", "#main");

    expect(
      screen.getByRole("heading", { level: 1, name: "a11y-ui-kit" }),
    ).toBeInTheDocument();

    for (const name of ["Вкладки", "Подсказка", "Поле ввода", "Клавиатура"]) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
  });

  it("сообщает о сохранении и возвращает кнопку в рабочее состояние", () => {
    // Таймеры подменяются только в этом тесте. user-event вместе с фейковыми
    // таймерами Vitest зависает на ожидании внутри Testing Library,
    // поэтому клик отправляется через fireEvent.
    vi.useFakeTimers();

    renderApp();

    const save = screen.getByRole("button", { name: "Сохранить" });

    fireEvent.click(save);

    expect(screen.getByText("Идёт сохранение…")).toBeInTheDocument();
    expect(save).toHaveAttribute("aria-busy", "true");

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText("Изменения сохранены.")).toBeInTheDocument();
    expect(save).not.toHaveAttribute("aria-busy", "true");
  });

  it("подтверждает удаление через диалог и возвращает фокус на кнопку", async () => {
    const user = userEvent.setup();

    renderApp();

    const trigger = screen.getByRole("button", { name: "Удалить проект" });

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", {
      name: "Удалить проект?",
    });

    await user.click(within(dialog).getByRole("button", { name: "Удалить" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Проект удалён. Это демо: на самом деле ничего не удалялось.",
      ),
    ).toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("переключает вкладки стрелками", async () => {
    const user = userEvent.setup();

    renderApp();

    expect(
      screen.getByRole("tablist", { name: "Сведения о проекте" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Обзор" }));
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Активность" })).toHaveFocus();
    expect(
      screen.getByRole("tabpanel", { name: "Активность" }),
    ).toHaveTextContent("Последние изменения и комментарии команды.");
  });

  it("показывает подсказку недоступной кнопки по фокусу с клавиатуры", async () => {
    const user = userEvent.setup();

    renderApp();

    const send = screen.getByRole("button", { name: "Отправить" });

    expect(send).toHaveAttribute("aria-disabled", "true");

    send.focus();

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Заполните все поля, чтобы отправить",
    );
    expect(send).toHaveAccessibleDescription(
      "Заполните все поля, чтобы отправить",
    );

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    expect(send).toHaveFocus();
  });

  describe("форма подписки", () => {
    it("не показывает ошибку, пока пользователь просто проходит полем табом", async () => {
      const user = userEvent.setup();

      renderApp();

      const input = screen.getByRole("textbox", { name: "Email" });

      input.focus();

      await user.tab();

      expect(input).not.toHaveAttribute("aria-invalid");
    });

    it("при отправке пустого поля показывает ошибку и возвращает фокус в поле", async () => {
      const user = userEvent.setup();

      renderApp();

      await user.click(screen.getByRole("button", { name: "Подписаться" }));

      const input = screen.getByRole("textbox", { name: "Email" });

      expect(input).toHaveFocus();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription(
        /Мы отправим на этот адрес ссылку для входа\..*Введите email\./,
      );
    });

    it("проверяет формат при уходе с поля и снимает ошибку после исправления", async () => {
      const user = userEvent.setup();

      renderApp();

      const input = screen.getByRole("textbox", { name: "Email" });

      await user.type(input, "anna@");
      await user.tab();

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription(
        /Введите адрес в формате name@example\.com\./,
      );

      await user.click(input);
      await user.type(input, "example.com");

      expect(input).not.toHaveAttribute("aria-invalid");
      expect(input).not.toHaveAccessibleDescription(/Введите/);
    });

    it("принимает корректный адрес, очищает поле и сообщает об успехе", async () => {
      const user = userEvent.setup();

      renderApp();

      const input = screen.getByRole("textbox", { name: "Email" });

      await user.type(input, "anna@example.com");
      await user.click(screen.getByRole("button", { name: "Подписаться" }));

      expect(
        screen.getByText(
          "Подписка оформлена. Это демо: ничего не отправлялось.",
        ),
      ).toBeInTheDocument();
      expect(input).toHaveValue("");
      expect(input).not.toHaveAttribute("aria-invalid");
    });
  });
});
