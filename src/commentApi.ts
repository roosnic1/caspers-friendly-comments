import express from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
const router = express.Router()
const prisma = new PrismaClient()

export const FAMOUS_GHOST_NAMES = [
    'Casper the Friendly Ghost',
    'The Flying Dutchman',
    'Slimer',
    "Hamlet's father",
    'Blinky',
    'Pinky',
    'Inky',
    'Clyde',
    'Sue',
]

router.post('/', async (req, res) => {
    const { articleID, text, parentCommentID } = req.body
    if (!articleID || !text)
        return res
            .status(400)
            .json({ error: 'articleID and text are required' })
    try {
        const result = await prisma.comment.create({
            data: {
                article: { connect: { id: articleID } },
                userName:
                    FAMOUS_GHOST_NAMES[
                        Math.floor(Math.random() * FAMOUS_GHOST_NAMES.length)
                    ],
                text,
                ...(parentCommentID
                    ? { parentComment: { connect: { id: parentCommentID } } }
                    : {}),
            },
        })
        res.json(result)
    } catch (error) {
        const prismaError = error as Prisma.PrismaClientKnownRequestError
        if (prismaError.code === 'P2025') {
            res.status(404).json({ error: 'article does not exist' })
        } else {
            res.status(500).json({ error: prismaError.message })
        }
    }
})

router.get('/:commentID/upvote', async (req, res) => {
    const { commentID } = req.params
    if (!commentID)
        return res.status(400).json({ error: 'commentID is required' })

    try {
        const result = await prisma.comment.update({
            where: { id: commentID },
            data: {
                upvotes: { increment: 1 },
            },
        })
        res.json(result)
    } catch (error) {
        const prismaError = error as Prisma.PrismaClientKnownRequestError
        if (prismaError.code === 'P2025') {
            res.status(404).json({ error: 'comment does not exist' })
        } else {
            res.status(500).json({ error: prismaError.message })
        }
    }
})

export default router
