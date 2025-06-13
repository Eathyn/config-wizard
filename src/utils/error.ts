export default function handleError(message: string, error: unknown) {
  if (error instanceof Error) {
    if (message) {
      console.error(`\n${message}: `)
    }
    console.error(error)
  } else {
    const err = new Error(`${JSON.stringify(error)}`)
    if (message) {
      console.error(`\n${message}: `)
    }
    console.error(err)
  }
  process.exit(1)
}
