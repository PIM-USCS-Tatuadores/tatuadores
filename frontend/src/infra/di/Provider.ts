import { DependencyContainer } from "./DependencyContainer";

export class Provider {
  static provide(key: string, dependency: any) {
    const registry = DependencyContainer.getInstance()
    registry.register(key, dependency)
  }
}
