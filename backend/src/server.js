const app = require('./app.js')

const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log(`server running at port ${PORT}`)
})