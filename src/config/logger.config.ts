import pino from 'pino'

const formatter = {
  level(level: string) {
    return { level }
  },
}

export const loggerOptions = {
  level: 'info',
  formatters: formatter,
  serializers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res: (res: any) => {
      return { statusCode: res.statusCode, customLog: res.raw.customLog }
    },
  },
}

export const logger = pino(loggerOptions)
