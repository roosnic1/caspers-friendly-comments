import { WebSocket } from 'ws'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

const activeWebsocketClients: WebSocket[] = []
export default function (ws: WebSocket): void {
    activeWebsocketClients.push(ws)
    ws.on('message', async function (msg: any) {
        let data
        try {
            data = JSON.parse(msg)
        } catch (error) {
            ws.send(
                JSON.stringify({
                    type: 'error',
                    message: 'could not parse JSON',
                })
            )
        }

        if (data.type === 'upvote') {
            if (!data.commentID) {
                ws.send(
                    JSON.stringify({
                        type: 'error',
                        message: 'commentID is required',
                    })
                )
                return
            }
            try {
                const result = await prisma.comment.update({
                    where: { id: data.commentID },
                    data: {
                        upvotes: { increment: 1 },
                    },
                })
                activeWebsocketClients.forEach((websocket) => {
                    websocket.send(
                        JSON.stringify({
                            type: 'upvote',
                            commentID: result.id,
                            upvotes: result.upvotes,
                        })
                    )
                })
            } catch (error) {
                const prismaError =
                    error as Prisma.PrismaClientKnownRequestError
                if (prismaError.code === 'P2025') {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: 'comment does not exist',
                        })
                    )
                } else {
                    ws.send(
                        JSON.stringify({
                            type: 'error',
                            message: prismaError.message,
                        })
                    )
                }
            }
        } else {
            console.log('message', msg)
        }
    })
}
