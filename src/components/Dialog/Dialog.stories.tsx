import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../Button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from ".";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Открыть диалог</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Сохранить изменения?</DialogTitle>

        <DialogDescription>
          У вас есть несохранённые изменения. Вы можете сохранить их или
          продолжить редактирование.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Продолжить редактирование</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="primary">Сохранить</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", {
      name: "Открыть диалог",
    });

    // Проверяем открытие с клавиатуры.
    await userEvent.tab();

    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    // Проверяем доступное имя диалога.
    const dialog = await body.findByRole("dialog", {
      name: "Сохранить изменения?",
    });

    await expect(dialog).toHaveAccessibleDescription(/несохранённые изменения/);

    // Начальный фокус должен попасть на первую кнопку.
    const firstButton = within(dialog).getByRole("button", {
      name: "Продолжить редактирование",
    });

    await waitFor(() => {
      expect(firstButton).toHaveFocus();
    });

    // Проверяем циклическую навигацию по фокусируемым элементам:
    // Первая кнопка → Сохранить → Закрыть → Первая кнопка.
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await expect(firstButton).toHaveFocus();

    // Закрываем диалог клавишей Escape.
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Фокус должен вернуться на кнопку открытия.
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  },
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Удалить проект</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Удалить проект?</DialogTitle>

        <DialogDescription>
          Это действие нельзя отменить. Все данные проекта будут удалены.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Отмена</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="danger">Удалить</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", {
      name: "Удалить проект",
    });

    await userEvent.tab();

    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    const dialog = await body.findByRole("dialog", {
      name: "Удалить проект?",
    });

    await expect(dialog).toHaveAccessibleDescription(
      /Это действие нельзя отменить/,
    );

    const cancelButton = within(dialog).getByRole("button", {
      name: "Отмена",
    });

    await waitFor(() => {
      expect(cancelButton).toHaveFocus();
    });

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  },
};

// Общая разметка для историй ниже: диалог «Сохранить изменения?».

function SaveDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button>Открыть диалог</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Сохранить изменения?</DialogTitle>

        <DialogDescription>
          У вас есть несохранённые изменения.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Продолжить редактирование</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="primary">Сохранить</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Open
//
// История остаётся с открытым диалогом. Аддон a11y запускает axe после
// play-функции, поэтому именно эта история проверяет доступность открытого
// окна (в Default и Confirmation диалог к тому моменту уже закрыт).

export const Open: Story = {
  render: () => <SaveDialog defaultOpen />,

  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 360 } },
  },

  play: async () => {
    const dialog = await within(document.body).findByRole("dialog", {
      name: "Сохранить изменения?",
    });

    // Ждём конца анимации появления: axe, запущенный посреди неё,
    // видит полупрозрачные цвета и может ложно сообщить о контрасте.
    await waitFor(() => {
      expect(getComputedStyle(dialog).opacity).toBe("1");
    });
  },
};

// ModalBehavior

export const ModalBehavior: Story = {
  render: () => <SaveDialog />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", { name: "Открыть диалог" });

    await userEvent.click(trigger);

    const dialog = await body.findByRole("dialog", {
      name: "Сохранить изменения?",
    });

    // Содержимое страницы под диалогом скрыто от скринридера.
    await expect(
      body.queryByRole("button", { name: "Открыть диалог" }),
    ).not.toBeInTheDocument();

    const firstButton = within(dialog).getByRole("button", {
      name: "Продолжить редактирование",
    });

    await waitFor(() => {
      expect(firstButton).toHaveFocus();
    });

    // Shift+Tab с первого элемента переходит на последний: кнопку закрытия.
    await userEvent.tab({ shift: true });

    await expect(
      within(dialog).getByRole("button", { name: "Закрыть диалог" }),
    ).toHaveFocus();
  },
};

// CloseWithButton

export const CloseWithButton: Story = {
  render: () => <SaveDialog />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", { name: "Открыть диалог" });

    await userEvent.click(trigger);

    const dialog = await body.findByRole("dialog");

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Закрыть диалог" }),
    );

    await waitFor(() => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Фокус возвращается на кнопку, которая открыла диалог.
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  },
};

// CloseWithOverlay

export const CloseWithOverlay: Story = {
  render: () => <SaveDialog />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", { name: "Открыть диалог" });

    await userEvent.click(trigger);

    const dialog = await body.findByRole("dialog");

    // Оверлей в Radix стоит в DOM сразу перед содержимым диалога.
    const overlay = dialog.previousElementSibling;

    if (!(overlay instanceof HTMLElement)) {
      throw new Error("Не найден оверлей диалога");
    }

    await userEvent.click(overlay);

    await waitFor(() => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  },
};
