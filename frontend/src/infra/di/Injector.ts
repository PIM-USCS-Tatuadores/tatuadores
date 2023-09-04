import { DependencyContainer } from "./DependencyContainer"

export class Injector {
  static inject<T>(key: string) {
    const registry = DependencyContainer.getInstance()
    return registry.get<T>(key)
  }
}
