require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectToDB = require('./db')
const notFoundHandler = require('./errorhandlers/notFoundHandler')
const errorHandler = require('./errorhandlers/errorHandler')

const app = express()
const port = process.env.PORT || 5000

// routers
const authRouter = require('./routers/authRoutes')
const postRouter = require('./routers/postRoutes')
const auth = require('./middleware/auth')

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', authRouter)
app.use('/api/posts', auth, postRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const start = async () => {
    try {
      await connectToDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (e) {
        console.log("Connection error.")
        console.log(e.message)
    }
  };
  start()