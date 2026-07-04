/**
 * Runtime configuration values used across application services.
 */
export type AppConfig = {
  readonly backendUrl: string | null
}

/**
 * Reads runtime application configuration from environment variables.
 *
 * @returns The normalized application configuration.
 */
export function getAppConfig(): AppConfig {
  return {
    backendUrl: process.env.MN_BACKEND_URL || null
  }
}
