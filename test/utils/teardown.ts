export default async () => {
  await global.__DB_INSTANCE__.stop()
}
