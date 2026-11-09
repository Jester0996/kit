import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from ".";

function renderTabs(props: TabsProps = {}) {
  return render(
    <Tabs defaultValue="one" {...props}>
      <TabsList aria-label="Разделы">
        <TabsTrigger value="one">Первый</TabsTrigger>
        <TabsTrigger value="two">Второй</TabsTrigger>
        <TabsTrigger value="three">Третий</TabsTrigger>
      </TabsList>

      <TabsContent value="one">Содержимое первого</TabsContent>
      <TabsContent value="two">Содержимое второго</TabsContent>
      <TabsContent value="three">Содержимое третьего</TabsContent>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("задаёт роли tablist, tab и tabpanel с доступными именами", () => {
    renderTabs();

    expect(
      screen.getByRole("tablist", { name: "Разделы" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("tab")).toHaveLength(3);

    expect(screen.getByRole("tabpanel", { name: "Первый" })).toHaveTextContent(
      "Содержимое первого",
    );
  });

  it("показывает только панель активной вкладки", () => {
    renderTabs({ defaultValue: "two" });

    expect(screen.getByRole("tab", { name: "Второй" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Содержимое второго",
    );
  });

  it("оставляет в порядке табуляции только активную вкладку", async () => {
    const user = userEvent.setup();

    renderTabs();

    expect(screen.getByRole("tab", { name: "Второй" })).toHaveAttribute(
      "tabindex",
      "-1",
    );

    await user.tab();

    expect(screen.getByRole("tab", { name: "Первый" })).toHaveFocus();
  });

  it("переключает вкладки стрелками, а Home и End ведут к краям", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderTabs({ onValueChange });

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Второй" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("two");

    await user.keyboard("{End}");

    expect(screen.getByRole("tab", { name: "Третий" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Содержимое третьего",
    );

    await user.keyboard("{Home}");

    expect(screen.getByRole("tab", { name: "Первый" })).toHaveFocus();
  });

  it("зацикливает фокус на краях списка", async () => {
    const user = userEvent.setup();

    renderTabs();

    await user.tab();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("tab", { name: "Третий" })).toHaveFocus();
  });

  it("в ручном режиме стрелка двигает фокус, а Enter активирует вкладку", async () => {
    const user = userEvent.setup();

    renderTabs({ activationMode: "manual" });

    await user.tab();
    await user.keyboard("{ArrowRight}");

    const second = screen.getByRole("tab", { name: "Второй" });

    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{Enter}");

    expect(second).toHaveAttribute("aria-selected", "true");
  });

  it("пропускает недоступную вкладку при навигации", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Разделы">
          <TabsTrigger value="one">Первый</TabsTrigger>
          <TabsTrigger value="two" disabled>
            Второй
          </TabsTrigger>
          <TabsTrigger value="three">Третий</TabsTrigger>
        </TabsList>

        <TabsContent value="one">Один</TabsContent>
        <TabsContent value="two">Два</TabsContent>
        <TabsContent value="three">Три</TabsContent>
      </Tabs>,
    );

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Третий" })).toHaveFocus();
  });

  it("переносит фокус с вкладки в панель по Tab", async () => {
    const user = userEvent.setup();

    renderTabs();

    await user.tab();
    await user.tab();

    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("в вертикальном режиме использует aria-orientation и стрелки вверх и вниз", async () => {
    const user = userEvent.setup();

    renderTabs({ orientation: "vertical" });

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );

    await user.tab();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("tab", { name: "Второй" })).toHaveFocus();
  });
});
