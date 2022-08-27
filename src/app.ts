import { PrismaClient } from '@prisma/client'
import express from 'express'
import moment from 'moment'
import commentApi from './commentApi'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})
const app = express()

app.set('view engine', 'pug')
app.use(express.json())
app.use(express.static('./public'))
app.locals.moment = moment

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
        include: {
            comments: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    })
    res.render('article', {
        article,
    })
})

export default app
