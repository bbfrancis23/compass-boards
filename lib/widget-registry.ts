import type { WidgetDefinition, WidgetKind } from "./widget-types";

// Widget configs vary per type, so the registry necessarily erases TConfig
// once a definition is stored; register()/get() stay generic at the call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWidgetDefinition = WidgetDefinition<any>;

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
    JSON.stringify(a.defaultConfig) === JSON.stringify(b.defaultConfig)
  );
}

class WidgetRegistry {
  private definitions = new Map<string, AnyWidgetDefinition>();

  register<TConfig>(definition: WidgetDefinition<TConfig>): void {
    const existing = this.definitions.get(definition.type);
    if (existing && !definitionsMatch(existing, definition)) {
      throw new Error(`Widget type "${definition.type}" is already registered`);
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
