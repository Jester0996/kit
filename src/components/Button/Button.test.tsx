import { createRef, type FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from ".";

describe("Button", () => {
  it("берёт доступное имя из children", () => {
    render(<Button>Сохранить</Button>);

    expect(
      screen.getByRole("button", { name: "Сохранить" }),
    ).toBeInTheDocument();
  });

  it("по умолчанию имеет type=button", () => {
    render(<Button>Сохранить</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("не вызывает onClick, когда disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Сохранить
      </Button>,
    );

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("активируется клавишами Enter и Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Сохранить</Button>);

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("при загрузке игнорирует нажатия и не теряет фокус", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button isLoading onClick={onClick}>
        Сохранение...
      </Button>,
    );

    await user.tab();

    const button = screen.getByRole("button");

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");

    await user.keyboard("{Enter}");

    expect(onClick).not.toHaveBeenCalled();
  });

  it("пробрасывает ref на элемент button", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Сохранить</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("aria-disabled блокирует onClick, но оставляет кнопку в порядке фокуса", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button aria-disabled="true" onClick={onClick}>
        Сохранить
      </Button>,
    );

    await user.tab();

    const button = screen.getByRole("button");

    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("не отправляет форму, пока кнопка в состоянии загрузки", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" isLoading>
          Отправить
        </Button>
      </form>,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
