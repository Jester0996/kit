import type { ComponentPropsWithRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cx } from "../../utils/cx";
import styles from "./Tooltip.module.css";

/**
 * Провайдер задаёт задержки показа для всех подсказок внутри.
 * Оберните им приложение один раз, а не каждую подсказку.
 */
export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

/**
 * Триггер должен быть фокусируемым элементом (кнопка, ссылка, поле),
 * иначе подсказка недоступна с клавиатуры. Используйте asChild.
 */
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentProps = ComponentPropsWithRef<
  typeof TooltipPrimitive.Content
>;

/**
 * Содержимое подсказки: только короткий текст, без ссылок и кнопок.
 * Подсказка закрывается по Esc, остаётся открытой при наведении на неё
 * и не пропадает, пока триггер в фокусе (WCAG 2.2, критерий 1.4.13).
 */
export function TooltipContent({
  className,
  children,
  sideOffset = 6,
  collisionPadding = 8,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cx(styles.content, className)}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
