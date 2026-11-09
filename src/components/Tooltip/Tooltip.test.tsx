import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "../Button";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from ".";

function renderTooltip() {
  return render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Сохранить</Button>
        </TooltipTrigger>

        <TooltipContent>Сохранить изменения (Ctrl+S)</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe("Tooltip", () => {
  it("закрыта, пока триггер не получил фокус или наведение", () => {
    renderTooltip();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("открывается при фокусе с клавиатуры и описывает триггер", async () => {
    const user = userEvent.setup();

    renderTooltip();

    await user.tab();

    const trigger = screen.getByRole("button", { name: "Сохранить" });

    expect(trigger).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Сохранить изменения (Ctrl+S)",
    );
    expect(trigger).toHaveAccessibleDescription("Сохранить изменения (Ctrl+S)");
  });

  it("закрывается по Escape, фокус остаётся на триггере", async () => {
    const user = userEvent.setup();

    renderTooltip();

    await user.tab();
    await screen.findByRole("tooltip");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Сохранить" })).toHaveFocus();
  });

  it("открывается при наведении указателя", async () => {
    const user = userEvent.setup();

    renderTooltip();

    await user.hover(screen.getByRole("button", { name: "Сохранить" }));

    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });
});
