import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import commentApi from './commentApi'

const prisma = new PrismaClient()
const app = express()

app.set('view engine', 'pug')
app.use(express.json())
app.use(express.static('./public'))

app.use('/api/v1/comment', commentApi)

app.get('/', async (req, res) => {
    const result = await prisma.article.findMany()
    res.render('index', {
        title: 'Hey',
        message: 'Hello there!',
        articles: result,
    })
})

app.get('/:articleID', async (req, res) => {
    const { articleID } = req.params
    const article = await prisma.article.findUnique({
        where: { id: articleID },
    })
    res.render('article', {
        article,
    })
})

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`)
)
