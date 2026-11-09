import type { ComponentProps, MouseEvent, ReactNode } from "react";

import { cx } from "../../utils/cx";
import styles from "./Button.module.css";

/** Варианты оформления кнопки. */
export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

/** Размеры кнопки. */
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentProps<"button"> {
  /** Визуальный стиль кнопки. */
  variant?: ButtonVariant;

  /** Размер кнопки. */
  size?: ButtonSize;

  /**
   * Показывает индикатор загрузки.
   * Кнопка остаётся фокусируемой, но не реагирует на нажатия.
   */
  isLoading?: boolean;

  /**
   * Содержимое кнопки.
   * Для кнопки без видимого текста передайте aria-label.
   */
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  type = "button",
  disabled = false,
  className,
  children,
  onClick,
  "aria-disabled": ariaDisabled,
  "aria-busy": ariaBusy,
  ...props
}: ButtonProps) {
  const isAriaDisabled = ariaDisabled === true || ariaDisabled === "true";

  const isInteractionDisabled = disabled || isLoading || isAriaDisabled;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isInteractionDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={cx(styles.button, styles[variant], styles[size], className)}
      aria-busy={isLoading ? true : ariaBusy}
      aria-disabled={isLoading ? true : ariaDisabled}
      onClick={handleClick}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}

      {children}
    </button>
  );
}
