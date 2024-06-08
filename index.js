
// 1. To load .env file 
    require('dotenv').config()

// 2. Import express  
    const express = require('express')

// import router
    const router = require('./Routes/routes')

// import db
    require('./DB/connection')

    // const middlewares = require('./Middlewares/appMiddleware')

// 3. Import cors
    const cors = require('cors') 

// 4. Create express server
    const pfServer = express()

// 5. Use cors 
    pfServer.use(cors())

// 6. Parse json data using server app
    pfServer.use(express.json()) 

    // pfServer.use(middlewares.appMiddleware)

    // use router
    pfServer.use(router)


// 7. Customise port for server app
    const PORT = 4000 || process.env.PORT

    // export uploads folder
    pfServer.use('/uploads',express.static('./uploads'))

// 8. To run server app
    pfServer.listen(PORT,()=>{
        console.log(`Project-Fair Server started at port : ${PORT}`);
    })

// 9. Resolve request to localhost:4000

pfServer.get('/',(req,res)=>{
    res.send(`<h1>Project Fair Server Started & Waiting For Request!!!!</h1>`)
})

// 10. Install npm i -g nodemon for auto recompilation and run command nodemon index.js next time when you change anything in index.js it will recompile automatically with manuallu running node index.js u have to start at begining only using command nodemon index.js ( 31/10/2023 video for rewatching )
