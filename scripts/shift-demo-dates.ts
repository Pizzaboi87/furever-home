import 'dotenv/config'

import { shiftAllDemoDatesByOneDay } from '../lib/server/demo-date-shift/demo-date-shift-service'

const main = async () => {
  const result = await shiftAllDemoDatesByOneDay()
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error: unknown) => {
  console.error('Daily demo date shift failed.', error)
  process.exitCode = 1
})
