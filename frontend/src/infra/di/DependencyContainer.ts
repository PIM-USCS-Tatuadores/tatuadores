export class DependencyContainer {
  private dependencies = new Map<string, any>()
  private static instance: DependencyContainer

  private constructor() {}

  static getInstance() {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer()
    }
    return DependencyContainer.instance
  }

  get<T>(key: string): T {
    return this.dependencies.get(key) as T
  }

  register(key: string, dependency: any) {
    this.dependencies.set(key, dependency)
  }
}
