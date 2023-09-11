import { listen } from "./app"

const port = process.env.NODE_PORT || 3001

listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
