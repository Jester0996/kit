import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button, type ButtonVariant } from "./components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./components/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/Tabs";
import { TextField } from "./components/TextField";
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/Tooltip";

import styles from "./App.module.css";

const SAVE_DELAY_MS = 1500;

// Адрес Storybook подставляется при сборке (VITE_STORYBOOK_URL, см. CI).
// Локально его нет, и тогда вместо ссылки выводится обычный текст.
const STORYBOOK_URL: string | undefined = import.meta.env.VITE_STORYBOOK_URL;
const STORYBOOK_LABEL = "в Storybook";

const VARIANTS = [
  { variant: "primary", label: "Основная" },
  { variant: "secondary", label: "Вторичная" },
  { variant: "outline", label: "Контурная" },
  { variant: "danger", label: "Опасная" },
] as const satisfies readonly {
  variant: ButtonVariant;
  label: string;
}[];

const PROJECT_TABS = [
  {
    value: "overview",
    label: "Обзор",
    text: "Общая информация о проекте: описание, участники и сроки.",
  },
  {
    value: "activity",
    label: "Активность",
    text: "Последние изменения и комментарии команды.",
  },
  {
    value: "settings",
    label: "Настройки",
    text: "Название, доступ и параметры уведомлений.",
  },
] as const;

const SHORTCUTS = [
  {
    keys: ["Tab", "Shift + Tab"],
    action: "Перейти к следующему или предыдущему элементу",
  },
  {
    keys: ["Enter", "Space"],
    action: "Нажать на кнопку",
  },
  {
    keys: ["Стрелка влево", "Стрелка вправо"],
    action: "Переключить вкладку",
  },
  {
    keys: ["Home", "End"],
    action: "Перейти к первой или последней вкладке",
  },
  {
    keys: ["Esc"],
    action: "Закрыть диалог: фокус вернётся на кнопку, которая его открыла",
  },
  {
    keys: ["Esc"],
    action: "Закрыть подсказку: фокус останется на кнопке",
  },
] as const;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

/** Возвращает текст ошибки или пустую строку, если адрес корректен. */
function validateEmail(value: string): string {
  if (value.trim() === "") {
    return "Введите email.";
  }

  if (!EMAIL_PATTERN.test(value)) {
    return "Введите адрес в формате name@example.com.";
  }

  return "";
}

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    setEmail(value);
    setMessage("");

    // Пока ошибка показана, она обновляется по мере ввода и исчезает,
    // как только адрес исправлен. Новую ошибку до ухода с поля не показываем.
    if (error) {
      setError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    // Пустое поле при простом проходе табом не считаем ошибкой.
    if (email !== "") {
      setError(validateEmail(email));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateEmail(email);

    setError(validationError);

    if (validationError) {
      // Фокус на поле с ошибкой: скринридер сразу прочитает подпись и ошибку.
      inputRef.current?.focus();
      setMessage("");
      return;
    }

    setEmail("");
    setMessage("Подписка оформлена. Это демо: ничего не отправлялось.");
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <TextField
        ref={inputRef}
        label="Email"
        description="Мы отправим на этот адрес ссылку для входа."
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        error={error}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
        onBlur={handleBlur}
      />

      <div>
        <Button type="submit">Подписаться</Button>
      </div>

      <output className={styles.status}>{message}</output>
    </form>
  );
}

export default function App() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      window.clearTimeout(saveTimer.current);
    };
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage("Идёт сохранение…");

    saveTimer.current = window.setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Изменения сохранены.");
    }, SAVE_DELAY_MS);
  };

  const handleDelete = () => {
    setDeleteMessage(
      "Проект удалён. Это демо: на самом деле ничего не удалялось.",
    );
  };

  return (
    <>
      <a className={styles.skipLink} href="#main">
        Перейти к основному содержимому
      </a>

      <header className={styles.header}>
        <h1 className={styles.title}>Kit</h1>

        <p className={styles.lead}>
          Доступные React-компоненты на Radix UI: клавиатурная навигация, ARIA и
          управление фокусом. Полная документация и тесты —{" "}
          {STORYBOOK_URL ? (
            <a href={STORYBOOK_URL}>{STORYBOOK_LABEL}</a>
          ) : (
            STORYBOOK_LABEL
          )}
          .
        </p>
      </header>

      <main id="main" className={styles.main} tabIndex={-1}>
        <section className={styles.section} aria-labelledby="variants-title">
          <h2 id="variants-title" className={styles.sectionTitle}>
            Кнопка: варианты
          </h2>

          <div className={styles.row}>
            {VARIANTS.map(({ variant, label }) => (
              <Button key={variant} variant={variant}>
                {label}
              </Button>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="states-title">
          <h2 id="states-title" className={styles.sectionTitle}>
            Кнопка: состояния
          </h2>

          <p className={styles.sectionText}>
            Во время сохранения кнопка остаётся в порядке фокуса, но не
            реагирует на нажатия. Результат объявляется скринридером через
            live-область.
          </p>

          <div className={styles.row}>
            <Button isLoading={isSaving} onClick={handleSave}>
              Сохранить
            </Button>

            <Button disabled>Недоступно</Button>
          </div>

          <output className={styles.status}>{saveMessage}</output>
        </section>

        <section className={styles.section} aria-labelledby="dialog-title">
          <h2 id="dialog-title" className={styles.sectionTitle}>
            Диалог
          </h2>

          <p className={styles.sectionText}>
            Фокус заперт внутри диалога, Esc закрывает его и возвращает фокус на
            кнопку открытия.
          </p>

          <Dialog
            onOpenChange={(open) => {
              if (open) {
                setDeleteMessage("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="danger">Удалить проект</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Удалить проект?</DialogTitle>

              <DialogDescription>
                Это действие нельзя отменить. Все данные проекта будут удалены.
              </DialogDescription>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Отмена</Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button variant="danger" onClick={handleDelete}>
                    Удалить
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <output className={styles.status}>{deleteMessage}</output>
        </section>

        <section className={styles.section} aria-labelledby="tabs-title">
          <h2 id="tabs-title" className={styles.sectionTitle}>
            Вкладки
          </h2>

          <p className={styles.sectionText}>
            В порядок табуляции входит только активная вкладка. Между вкладками
            переключаются стрелками, а Tab переводит фокус в открытую панель.
          </p>

          <Tabs defaultValue={PROJECT_TABS[0].value}>
            <TabsList aria-label="Сведения о проекте">
              {PROJECT_TABS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {PROJECT_TABS.map(({ value, text }) => (
              <TabsContent key={value} value={value}>
                {text}
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section className={styles.section} aria-labelledby="tooltip-title">
          <h2 id="tooltip-title" className={styles.sectionTitle}>
            Подсказка
          </h2>

          <p className={styles.sectionText}>
            Подсказка открывается по фокусу и наведению, закрывается по Esc и не
            исчезает, пока на неё наведён курсор. На тач-экране она не
            открывается, поэтому важное в подсказки не кладётся. Недоступная
            кнопка сделана через aria-disabled: она получает фокус и объясняет,
            почему действие недоступно.
          </p>

          <div className={styles.row}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Экспорт</Button>
              </TooltipTrigger>

              <TooltipContent>Таблица в формате CSV, до 10 МБ</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-disabled="true">Отправить</Button>
              </TooltipTrigger>

              <TooltipContent>
                Заполните все поля, чтобы отправить
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="field-title">
          <h2 id="field-title" className={styles.sectionTitle}>
            Поле ввода
          </h2>

          <p className={styles.sectionText}>
            У поля есть видимая подпись, подсказка и текст ошибки, связанные с
            ним через aria-describedby. При ошибке в отправленной форме фокус
            возвращается в поле.
          </p>

          <SubscribeForm />
        </section>

        <section className={styles.section} aria-labelledby="keys-title">
          <h2 id="keys-title" className={styles.sectionTitle}>
            Клавиатура
          </h2>

          <table className={styles.table}>
            <caption className={styles.visuallyHidden}>
              Основные клавиши в компонентах кита
            </caption>

            <thead>
              <tr>
                <th scope="col">Клавиши</th>
                <th scope="col">Действие</th>
              </tr>
            </thead>

            <tbody>
              {SHORTCUTS.map(({ keys, action }) => (
                <tr key={action}>
                  <th scope="row">
                    {keys.map((key, index) => (
                      <span key={key}>
                        {index > 0 && <span className={styles.or}> или </span>}

                        <kbd className={styles.kbd}>{key}</kbd>
                      </span>
                    ))}
                  </th>

                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Демо-страница. Цель проекта — соответствие WCAG 2.2 AA.</p>
      </footer>
    </>
  );
}
