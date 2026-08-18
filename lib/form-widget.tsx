"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { addWidgetData } from "./widget-data-actions";
import type { WidgetComponentProps } from "./widget-types";

export type InputFieldType = "text" | "number" | "date";

export interface InputFieldConfig {
  key: string;
  label: string;
  type: InputFieldType;
  required?: boolean;
  placeholder?: string;
}

export interface FormWidgetConfig {
  /** Widget title shown in WidgetShell's title bar (falls back to the registry label). */
  title?: string;
  fields: InputFieldConfig[];
  submitLabel?: string;
}

function fieldInitialValue(field: InputFieldConfig) {
  return field.type === "number" ? 0 : "";
}

/**
 * Generic, config-driven input form. Declares its fields via
 * FormWidgetConfig and, on submit, writes them as a new widget_data row —
 * so a new input widget is mostly declarative (field list + labels)
 * instead of a bespoke form component per domain.
 */
export function FormWidget({ instance, boardId }: WidgetComponentProps<FormWidgetConfig>) {
  const config = instance.config;
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fields = config?.fields ?? [];

  const form = useForm({
    initialValues: Object.fromEntries(fields.map((field) => [field.key, fieldInitialValue(field)])),
    validate: Object.fromEntries(
      fields
        .filter((field) => field.required)
        .map((field) => [
          field.key,
          (value: unknown) =>
            value === "" || value === null || value === undefined
              ? `${field.label} is required`
              : null,
        ]),
    ),
  });

  if (!config) {
    return (
      <Text size="sm" c="dimmed">
        Widget is not configured.
      </Text>
    );
  }

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addWidgetData(boardId, instance.id, values);
      form.reset();
    } catch (err) {
      console.error("Failed to save widget data", err);
      setSubmitError("Failed to save.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xs">
        {fields.map((field) => {
          if (field.type === "number") {
            return (
              <NumberInput
                key={field.key}
                name={field.key}
                label={field.label}
                placeholder={field.placeholder}
                {...form.getInputProps(field.key)}
              />
            );
          }
          if (field.type === "date") {
            return (
              <TextInput
                key={field.key}
                name={field.key}
                type="date"
                label={field.label}
                {...form.getInputProps(field.key)}
              />
            );
          }
          return (
            <TextInput
              key={field.key}
              name={field.key}
              label={field.label}
              placeholder={field.placeholder}
              {...form.getInputProps(field.key)}
            />
          );
        })}
        {submitError && (
          <Text c="red" size="sm">
            {submitError}
          </Text>
        )}
        <Button type="submit" loading={submitting} size="xs">
          {config.submitLabel ?? "Add"}
        </Button>
      </Stack>
    </form>
  );
}
