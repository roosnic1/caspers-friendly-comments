import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import commentApi from './commentApi'

const prisma = new PrismaClient()
const app = express()

app.set('view engine', 'pug')
app.use(express.json())
app.use(express.static('./public'))

app.use('/api/v1/comment', commentApi)

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Hey',
        message: 'Hello there!',
        articles: ['test1', 'test3', 'test5'],
    })
})

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`)
)
