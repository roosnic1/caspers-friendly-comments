import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import commentApi from './commentApi'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.use('/api/v1/comment', commentApi)

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`)
)
