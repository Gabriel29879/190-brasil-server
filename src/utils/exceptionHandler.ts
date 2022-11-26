export interface BaseError {
  readonly message: string
  readonly statusCode: number
  readonly customError: true
}

export const exceptionHandler = (message: string, statusCode = 500): BaseError => ({
  message,
  statusCode,
  customError: true,
})

export const baseExceptionHandler = <T>(error: T): T => error
