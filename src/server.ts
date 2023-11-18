import { app } from './app'

import mongoose from 'mongoose'
import config from './app/config'

const port = config.port

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    app.listen(port, () => {
      console.log('Server is running on port ' + port)
    })
  } catch (error) {
    console.error('Error starting the server:', error)
  }
}

main()
