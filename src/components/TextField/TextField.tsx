import { useId } from "react";
import type { ComponentProps } from "react";

import { cx } from "../../utils/cx";
import styles from "./TextField.module.css";

export interface TextFieldProps extends Omit<
  ComponentProps<"input">,
  "children"
> {
  /**
   * Видимая подпись поля. Обязательна: placeholder подпись не заменяет,
   * он исчезает при вводе и плохо читается.
   */
  label: string;

  /** Подсказка под подписью: формат, ограничения. */
  description?: string;

  /**
   * Текст ошибки. Пустое значение — ошибки нет.
   * Ошибка озвучивается скринридером при появлении и читается
   * вместе с полем при возврате фокуса.
   */
  error?: string;

  /** Класс обёртки поля (подпись, поле ввода и сообщения). */
  className?: string;
}

export function TextField({
  label,
  description,
  error,
  id,
  className,
  type = "text",
  required,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(error);

  const describedBy =
    cx(
      description ? descriptionId : null,
      hasError ? errorId : null,
      ariaDescribedBy,
    ) || undefined;

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}

        {required && (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}

      <input
        {...props}
        id={inputId}
        type={type}
        required={required}
        className={styles.input}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={describedBy}
      />

      {/* Контейнер есть в DOM всегда: изменение текста внутри
          уже существующей live-области озвучивается надёжнее,
          чем появление новой. */}
      <p id={errorId} className={styles.error} aria-live="polite">
        {error}
      </p>
    </div>
  );
}
