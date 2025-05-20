export default function handleError(message, error) {
  if (message) {
    console.error(`\n${message}: `)
  }
  console.error(error.message)
  process.exit(1)
}
