import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../Dialog";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from ".";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Короткая подсказка к элементу. Открывается по фокусу и наведению,",
          "закрывается по Esc, не пропадает при наведении на саму подсказку",
          "(WCAG 2.2, критерий 1.4.13).",
          "",
          "**Ограничения.** Подсказка не открывается на тач-экране, поэтому",
          "важную информацию в ней оставлять нельзя. Для кнопки-иконки с",
          "`aria-label` не повторяйте тот же текст в подсказке: скринридер",
          "получит имя и такое же описание. Добавьте полезное, например",
          "сочетание клавиш.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Сохранить</Button>
      </TooltipTrigger>

      <TooltipContent>Сохранить изменения (Ctrl+S)</TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

// Keyboard

export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", { name: "Сохранить" });

    // Подсказка закрыта, пока триггер не получил фокус.
    await expect(body.queryByRole("tooltip")).not.toBeInTheDocument();

    // Фокус с клавиатуры открывает подсказку.
    await userEvent.tab();

    await expect(trigger).toHaveFocus();

    const tooltip = await body.findByRole("tooltip");

    await expect(tooltip).toHaveTextContent("Сохранить изменения (Ctrl+S)");

    // Подсказка связана с триггером через aria-describedby.
    await expect(trigger).toHaveAccessibleDescription(
      "Сохранить изменения (Ctrl+S)",
    );

    // Esc закрывает подсказку (WCAG 1.4.13, Dismissible),
    // а фокус остаётся на триггере.
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(body.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    await expect(trigger).toHaveFocus();
  },
};

// Pointer

export const Pointer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", { name: "Сохранить" });

    await userEvent.hover(trigger);

    const tooltip = await body.findByRole("tooltip");

    // Указатель переходит на саму подсказку: она не должна исчезнуть
    // (WCAG 1.4.13, Hoverable).
    const content = tooltip.parentElement;

    if (!content) {
      throw new Error("Не найден элемент содержимого подсказки");
    }

    await userEvent.hover(content);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 400);
    });

    await expect(body.getByRole("tooltip")).toBeInTheDocument();
  },
};

// InsideDialog
//
// Подсказка внутри открытого диалога: она должна отображаться выше окна,
// принимать указатель, а Esc должен закрывать сначала подсказку и только
// затем сам диалог.

export const InsideDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>Сохранить изменения?</DialogTitle>

        <DialogDescription>
          Подсказка ниже работает и внутри диалога.
        </DialogDescription>

        <div style={{ marginTop: 16 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Сохранить</Button>
            </TooltipTrigger>

            <TooltipContent>Сохранить изменения (Ctrl+S)</TooltipContent>
          </Tooltip>
        </div>
      </DialogContent>
    </Dialog>
  ),

  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 360 } },
  },

  play: async () => {
    const body = within(document.body);

    const dialog = await body.findByRole("dialog", {
      name: "Сохранить изменения?",
    });

    // Ждём конца анимации появления диалога (см. историю Dialog/Open).
    await waitFor(() => {
      expect(getComputedStyle(dialog).opacity).toBe("1");
    });

    await userEvent.hover(
      within(dialog).getByRole("button", { name: "Сохранить" }),
    );

    const tooltip = await body.findByRole("tooltip");
    const content = tooltip.parentElement;

    if (!content) {
      throw new Error("Не найден элемент содержимого подсказки");
    }

    // В центре подсказки верхним элементом должна быть она сама,
    // а не диалог под ней.
    const rect = content.getBoundingClientRect();
    const topElement = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );

    await expect(content.contains(topElement)).toBe(true);

    // Первый Esc закрывает только подсказку.
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(body.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    await expect(body.getByRole("dialog")).toBeInTheDocument();
  },
};

// ExplainsUnavailableAction
//
// Кнопка с aria-disabled остаётся в порядке фокуса, поэтому подсказка
// с причиной недоступности открывается и с клавиатуры. У кнопки с атрибутом
// disabled фокуса нет, подсказка недоступна.

const unavailableOnClick = fn();

export const ExplainsUnavailableAction: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-disabled="true" onClick={unavailableOnClick}>
          Сохранить
        </Button>
      </TooltipTrigger>

      <TooltipContent>Заполните все поля, чтобы сохранить</TooltipContent>
    </Tooltip>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", { name: "Сохранить" });

    await userEvent.tab();

    await expect(trigger).toHaveFocus();
    await expect(await body.findByRole("tooltip")).toHaveTextContent(
      "Заполните все поля, чтобы сохранить",
    );
    await expect(trigger).toHaveAccessibleDescription(
      "Заполните все поля, чтобы сохранить",
    );

    // Нажатие не выполняет действие.
    await userEvent.keyboard("{Enter}");

    await expect(unavailableOnClick).not.toHaveBeenCalled();
  },
};
