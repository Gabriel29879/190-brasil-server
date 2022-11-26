/* eslint-disable functional/prefer-readonly-type */
declare namespace NodeJS {
  export type ProcessEnv = {
    readonly PORT: string
    readonly GOOGLE_API_KEY: string
    readonly LOCAL_ENV: string
    readonly DB_URI: string
    readonly JWT_SECRET: string
    readonly MASTER_API_KEY: string
    readonly DISABLE_GOOGLE_API: string
    __TEST_DB_URI__: string
  }
}
