import server from './app'
import supertest from 'supertest'
import { Comment, PrismaClient } from '@prisma/client'
const requestWithSupertest = supertest(server)
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

describe('Post comment', () => {
    const articleIDS: string[] = []

    beforeAll(async () => {
        const result = await prisma.article.findMany()
        articleIDS.push(...result.map((article) => article.id))
    })

    it('POST /api/v1/comment should creat a comment', async () => {
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

describe('Post child comment', () => {
    const comments: Comment[] = []

    beforeAll(async () => {
        const result = await prisma.comment.findMany({
            where: { parentCommentID: null },
        })
        comments.push(...result)
    })

    it('POST /api/v1/comment should creat a child comment', async () => {
        const parentComment = comments[0]
        const childCommentText = 'Test child comment'
        const res = await requestWithSupertest.post('/api/v1/comment').send({
            articleID: parentComment.articleID,
            parentCommentID: parentComment.id,
            text: childCommentText,
        })
        expect(res.status).toEqual(200)
        expect(res.type).toEqual(expect.stringContaining('json'))
        expect(res.body).toHaveProperty('id')

        const updatedParentComment = await prisma.comment.findUnique({
            where: { id: parentComment.id },
            include: {
                childComments: true,
            },
        })

        const childCommentID = res.body['id']
        expect(
            updatedParentComment?.childComments.find(
                (comment) => comment.id === childCommentID
            )?.text
        ).toBe(childCommentText)
    })
})

xdescribe('Upvote comment', () => {
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
