import server from '../app'
import supertest from 'supertest'
import { Comment, PrismaClient } from '@prisma/client'
import { join } from 'path'
import { execSync } from 'child_process'
const requestWithSupertest = supertest(server)
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

const prismaBinary = join(
    __dirname,
    '..',
    '..',
    'node_modules',
    '.bin',
    'prisma'
)

beforeAll(() => {
    execSync(`${prismaBinary} db push --force-reset`, {
        env: {
            ...process.env,
            DATABASE_URL: 'file:./test_dev.db',
        },
    })

    execSync(`${prismaBinary} db seed`, {
        env: {
            ...process.env,
            DATABASE_URL: 'file:./test_dev.db',
        },
    })
})

describe('Post comment', () => {
    const articleIDS: string[] = []

    beforeAll(async () => {
        const result = await prisma.article.findMany()
        articleIDS.push(...result.map((article) => article.id))
    })

    it('POST /api/v1/comment should creat a comment', async () => {
        console.log('articleID', articleIDS[0])
        const res = await requestWithSupertest.post('/api/v1/comment').send({
            articleID: articleIDS[0],
            text: 'Test comment',
        })
        expect(res.status).toEqual(200)
        expect(res.type).toEqual(expect.stringContaining('json'))
        expect(res.body).toHaveProperty('id')
    })

    it('POST /api/v1/comment without an articleID should return 400', async () => {
        const res = await requestWithSupertest.post('/api/v1/comment').send({
            text: 'Test comment',
        })
        expect(res.status).toEqual(400)
    })

    it('POST /api/v1/comment without a comment should return 400', async () => {
        const res = await requestWithSupertest.post('/api/v1/comment').send({
            articleID: articleIDS[0],
        })
        expect(res.status).toEqual(400)
    })

    it('POST /api/v1/comment with invalid articleID should return 404', async () => {
        const res = await requestWithSupertest.post('/api/v1/comment').send({
            articleID: 'doesNotExist',
            text: 'Test comment',
        })
        expect(res.status).toEqual(404)
    })
})

describe('Upvote comment', () => {
    const comments: Comment[] = []

    beforeAll(async () => {
        const result = await prisma.comment.findMany()
        comments.push(...result)
    })

    it('GET /api/v1/comment/:commentID/upvote should upvote the comment', async () => {
        const comment = comments[0]
        const res = await requestWithSupertest.get(
            `/api/v1/comment/${comment.id}/upvote`
        )
        expect(res.status).toEqual(200)
        expect(res.type).toEqual(expect.stringContaining('json'))
        expect(res.body).toHaveProperty('upvotes')
        expect(res.body.upvotes).toBe(comment.upvotes + 1)
    })

    it('GET /api/v1/comment/:commentID/upvote with invalid commentID should return 404', async () => {
        const res = await requestWithSupertest.get(
            `/api/v1/comment/doesNotExist/upvote`
        )
        expect(res.status).toEqual(404)
    })
})
