/**
 * Runtime configuration values used across application services.
 */
export type AppConfig = Record<string, never>

/**
 * Reads runtime application configuration from environment variables.
 *
 * @returns The normalized application configuration.
 */
export function getAppConfig(): AppConfig {
  return {}
}
