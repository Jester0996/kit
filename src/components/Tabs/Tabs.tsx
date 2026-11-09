import type { ComponentPropsWithRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cx } from "../../utils/cx";
import styles from "./Tabs.module.css";

export type TabsProps = ComponentPropsWithRef<typeof TabsPrimitive.Root>;

/**
 * Корень набора вкладок.
 *
 * Радикс обеспечивает паттерн WAI-ARIA Tabs: роли tablist, tab и tabpanel,
 * связи aria-controls и aria-labelledby, roving tabindex (в порядке
 * табуляции только активная вкладка) и стрелки, Home и End.
 */
export function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root className={cx(styles.root, className)} {...props} />
  );
}

/**
 * Доступное имя списка вкладок обязательно: передайте либо aria-label,
 * либо aria-labelledby. Без имени скринридер объявит просто «список вкладок».
 */
type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

export type TabsListProps = Omit<
  ComponentPropsWithRef<typeof TabsPrimitive.List>,
  "aria-label" | "aria-labelledby"
> &
  AccessibleName;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List className={cx(styles.list, className)} {...props} />
  );
}

export type TabsTriggerProps = ComponentPropsWithRef<
  typeof TabsPrimitive.Trigger
>;

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cx(styles.trigger, className)}
      {...props}
    />
  );
}

export type TabsContentProps = ComponentPropsWithRef<
  typeof TabsPrimitive.Content
>;

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      className={cx(styles.content, className)}
      {...props}
    />
  );
}
