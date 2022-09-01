import { PrismaClient } from '@prisma/client'
import express from 'express'
import ExpressWs from 'express-ws'
import moment from 'moment'
import commentApi from './commentApi'
import websocketMiddleware from './websocket'
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})
const baseApp = express()
const appWs = ExpressWs(baseApp)

const { app } = appWs

app.set('view engine', 'pug')
app.use(express.json())
app.use(express.static('./public'))
app.locals.moment = moment

app.use('/api/v1/comment', commentApi)
app.ws('/ws', websocketMiddleware)

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
                where: { parentCommentID: null },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    childComments: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                },
            },
        },
    })
    res.render('article', {
        article,
    })
})

export default app
