import type { WidgetDefinition, WidgetKind } from "./widget-types";

// Widget configs vary per type, so the registry necessarily erases TConfig
// once a definition is stored; register()/get() stay generic at the call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWidgetDefinition = WidgetDefinition<any>;

class WidgetRegistry {
  private definitions = new Map<string, AnyWidgetDefinition>();

  register<TConfig>(definition: WidgetDefinition<TConfig>): void {
    if (this.definitions.has(definition.type)) {
      throw new Error(`Widget type "${definition.type}" is already registered`);
    }
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
