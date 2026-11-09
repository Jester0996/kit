import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from ".";

function ProjectTabs(args: TabsProps) {
  return (
    <Tabs {...args}>
      <TabsList aria-label="Сведения о проекте">
        <TabsTrigger value="overview">Обзор</TabsTrigger>
        <TabsTrigger value="activity">Активность</TabsTrigger>
        <TabsTrigger value="settings">Настройки</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        Общая информация о проекте: описание, участники и сроки.
      </TabsContent>

      <TabsContent value="activity">
        Последние изменения и комментарии команды.
      </TabsContent>

      <TabsContent value="settings">
        Название, доступ и параметры уведомлений.
      </TabsContent>
    </Tabs>
  );
}

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    defaultValue: "overview",
  },
  render: (args) => <ProjectTabs {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Default

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const overview = canvas.getByRole("tab", { name: "Обзор" });
    const activity = canvas.getByRole("tab", { name: "Активность" });
    const settings = canvas.getByRole("tab", { name: "Настройки" });

    // Список вкладок имеет доступное имя.
    await expect(
      canvas.getByRole("tablist", { name: "Сведения о проекте" }),
    ).toBeInTheDocument();

    // Tab попадает на активную вкладку.
    await userEvent.tab();

    await expect(overview).toHaveFocus();
    await expect(overview).toHaveAttribute("aria-selected", "true");

    // Roving tabindex: остальные вкладки вне порядка табуляции.
    await expect(activity).toHaveAttribute("tabindex", "-1");
    await expect(settings).toHaveAttribute("tabindex", "-1");

    // Стрелка вправо переключает вкладку и панель.
    await userEvent.keyboard("{ArrowRight}");

    await expect(activity).toHaveFocus();
    await expect(activity).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByRole("tabpanel", { name: "Активность" }),
    ).toBeVisible();

    // End переходит на последнюю вкладку.
    await userEvent.keyboard("{End}");

    await expect(settings).toHaveFocus();

    // Фокус зациклен: после последней вкладки идёт первая.
    await userEvent.keyboard("{ArrowRight}");

    await expect(overview).toHaveFocus();

    // Home тоже переходит на первую вкладку.
    await userEvent.keyboard("{End}");
    await userEvent.keyboard("{Home}");

    await expect(overview).toHaveFocus();

    // Следующий Tab уводит фокус с вкладки в её панель.
    await userEvent.tab();

    await expect(canvas.getByRole("tabpanel", { name: "Обзор" })).toHaveFocus();
  },
};

// ManualActivation

export const ManualActivation: Story = {
  args: {
    activationMode: "manual",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const overview = canvas.getByRole("tab", { name: "Обзор" });
    const activity = canvas.getByRole("tab", { name: "Активность" });

    await userEvent.tab();

    await expect(overview).toHaveFocus();

    // Стрелка двигает только фокус, вкладка не активируется.
    await userEvent.keyboard("{ArrowRight}");

    await expect(activity).toHaveFocus();
    await expect(activity).toHaveAttribute("aria-selected", "false");
    await expect(overview).toHaveAttribute("aria-selected", "true");

    // Enter активирует вкладку в фокусе.
    await userEvent.keyboard("{Enter}");

    await expect(activity).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByRole("tabpanel", { name: "Активность" }),
    ).toBeVisible();
  },
};

// Vertical

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const overview = canvas.getByRole("tab", { name: "Обзор" });
    const activity = canvas.getByRole("tab", { name: "Активность" });

    await expect(
      canvas.getByRole("tablist", { name: "Сведения о проекте" }),
    ).toHaveAttribute("aria-orientation", "vertical");

    await userEvent.tab();

    await expect(overview).toHaveFocus();

    // В вертикальном списке вкладки переключаются стрелками вверх и вниз.
    await userEvent.keyboard("{ArrowDown}");

    await expect(activity).toHaveFocus();
    await expect(activity).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowUp}");

    await expect(overview).toHaveFocus();
  },
};

// WithDisabledTab

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Параметры оплаты">
        <TabsTrigger value="card">Карта</TabsTrigger>
        <TabsTrigger value="invoice" disabled>
          Счёт
        </TabsTrigger>
        <TabsTrigger value="transfer">Перевод</TabsTrigger>
      </TabsList>

      <TabsContent value="card">Оплата банковской картой.</TabsContent>
      <TabsContent value="invoice">Оплата по счёту.</TabsContent>
      <TabsContent value="transfer">Оплата переводом.</TabsContent>
    </Tabs>
  ),

  args: {
    defaultValue: "card",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const card = canvas.getByRole("tab", { name: "Карта" });
    const invoice = canvas.getByRole("tab", { name: "Счёт" });
    const transfer = canvas.getByRole("tab", { name: "Перевод" });

    await expect(invoice).toBeDisabled();

    await userEvent.tab();

    await expect(card).toHaveFocus();

    // Недоступная вкладка пропускается.
    await userEvent.keyboard("{ArrowRight}");

    await expect(transfer).toHaveFocus();
    await expect(transfer).toHaveAttribute("aria-selected", "true");
  },
};
