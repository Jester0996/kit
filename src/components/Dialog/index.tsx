import type { ComponentPropsWithRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cx } from "../../utils/cx";
import styles from "./Dialog.module.css";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogClose = DialogPrimitive.Close;

type DialogTitleProps = ComponentPropsWithRef<typeof DialogPrimitive.Title>;

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title className={cx(styles.title, className)} {...props} />
  );
}

type DialogDescriptionProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Description
>;

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      className={cx(styles.description, className)}
      {...props}
    />
  );
}

export interface DialogContentProps extends ComponentPropsWithRef<
  typeof DialogPrimitive.Content
> {
  /** Доступное имя кнопки закрытия диалога. */
  closeLabel?: string;
}

export function DialogContent({
  className,
  children,
  closeLabel = "Закрыть диалог",
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />

      <DialogPrimitive.Content
        className={cx(styles.content, className)}
        {...props}
      >
        {children}

        <DialogPrimitive.Close
          type="button"
          className={styles.closeButton}
          aria-label={closeLabel}
        >
          <span aria-hidden="true">&times;</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogFooter({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return <div className={cx(styles.actions, className)} {...props} />;
}
