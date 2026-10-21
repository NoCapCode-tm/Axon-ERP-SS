import "./config/env.js"

import app from "./app.js"
import { connectdb } from "./database/dbconnect.js"

const PORT = process.env.PORT || 5000

connectdb()
.then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`)
    })
})
.catch((error) => {
    console.log(error)
})