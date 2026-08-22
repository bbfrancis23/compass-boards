import type { WidgetDefinition, WidgetKind } from "./widget-types";

// Widget configs vary per type, so the registry necessarily erases TConfig
// once a definition is stored; register()/get() stay generic at the call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWidgetDefinition = WidgetDefinition<any>;

// Order-insensitive structural equality for plain JSON-shaped data (every
// defaultConfig in this app — strings/numbers/booleans/arrays/nested plain
// objects, same shape as what's stored in the DB's JSON config columns).
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, i) => deepEqual(item, b[i]))
    );
  }

  const aRecord = a as Record<string, unknown>;
  const bRecord = b as Record<string, unknown>;
  const aKeys = Object.keys(aRecord);
  const bKeys = Object.keys(bRecord);
  return (
    aKeys.length === bKeys.length && aKeys.every((key) => deepEqual(aRecord[key], bRecord[key]))
  );
}

// Widget files self-register via a top-level call, which re-runs whenever
// Fast Refresh re-evaluates that module — not just on a cold load — so
// register() can't simply throw on any repeat type. This compares the
// fields that should be stable across a legitimate re-registration of the
// same widget (everything except `component`, since Fast Refresh is
// expected to hand back a fresh function reference for logically the same
// component). A mismatch here means two different widgets are genuinely
// colliding on the same type string, which is still worth throwing on.
function definitionsMatch(a: AnyWidgetDefinition, b: AnyWidgetDefinition): boolean {
  return (
    a.kind === b.kind &&
    a.label === b.label &&
    a.defaultSize.w === b.defaultSize.w &&
    a.defaultSize.h === b.defaultSize.h &&
    deepEqual(a.defaultConfig, b.defaultConfig)
  );
}

class WidgetRegistry {
  private definitions = new Map<string, AnyWidgetDefinition>();

  register<TConfig>(definition: WidgetDefinition<TConfig>): void {
    const existing = this.definitions.get(definition.type);
    if (existing && !definitionsMatch(existing, definition)) {
      throw new Error(
        `Widget type "${definition.type}" is already registered with a conflicting ` +
          `definition (kind, label, defaultSize, or defaultConfig differs) — two widgets ` +
          `are using the same type string.`,
      );
    }
    // Always store the incoming definition (not just on first sight), so a
    // Fast Refresh re-registration picks up its fresh `component` reference
    // instead of silently keeping the stale one from the previous module
    // evaluation.
    this.definitions.set(definition.type, definition);
  }

  get(type: string): AnyWidgetDefinition | undefined {
    return this.definitions.get(type);
  }

  list(kind?: WidgetKind): AnyWidgetDefinition[] {
    const all = Array.from(this.definitions.values());
    return kind ? all.filter((definition) => definition.kind === kind) : all;
  }
}

export const widgetRegistry = new WidgetRegistry();
