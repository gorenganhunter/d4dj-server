const { Sonolus, SonolusSpaShare } = require("@sonolus/express")
const express = require("express")

const sonolus = new Sonolus()
sonolus.load('./pack')

const sonolusShare = new SonolusSpaShare('./public')

const port = 8080
const app = express()

app.use(sonolus.router)
app.use(sonolusShare.router)

app.listen(port, () => {
    console.log('Server listening at port', port)
})
