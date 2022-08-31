import { PrismaClient, Prisma } from '@prisma/client'
import { FAMOUS_GHOST_NAMES } from '../src/commentApi'

const prisma = new PrismaClient()

const articleData: Prisma.ArticleCreateInput[] = [
    {
        title: 'Review of Ghost Story',
        content:
            'In the town of Milburn, New York, four old men gather to tell frightening stories as a hobby to divert themselves from their lives. But one story returns to haunt them. A wicked mistake. A horrifying accident. And they are about to learn that no one can bury the past forever. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    },
    {
        title: 'Review of The Shining',
        content:
            'Inspired by the real Stanley Hotel, this chilling tale starts with a troubled family trying to heal and pull itself back together, but as the harsh winter weather sets in, the idyllic location feels ever more remote and more sinister. The only one to notice the strange and terrible forces gathering around the Overlook is the uniquely gifted five-year-old boy. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    },
    {
        title: ' Review of Anna Dressed in Blood',
        content:
            "It's the old boy-meets-girl story, if the boy is a wry, self-destructive ghost-hunter bent on avenging his father and the girl is a homicidal ghost trapped in a house full of everyone she's ever murdered in a smooth combination of gore and romance. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    },
]

const comments: string[] = [
    'One of the best books i ever read :)',
    'This book was too spooky for me.',
    'Number one book for me.',
    'Bought this book as a present for my friend.',
]

const childComments: string[] = [
    'You are absolutely right',
    'I disagree with you',
    'Right?!?',
]

async function main() {
    console.log(`Start seeding ...`)
    for (const a of articleData) {
        const article = await prisma.article.create({
            data: a,
        })
        console.log(`Created article with id: ${article.id}`)
    }
    const articles = await prisma.article.findMany()
    const articleIDs = articles.map((article) => article.id)
    for (const c of comments) {
        const comment = await prisma.comment.create({
            data: {
                articleID:
                    articleIDs[Math.floor(Math.random() * articleIDs.length)],
                text: c,
                userName:
                    FAMOUS_GHOST_NAMES[
                        Math.floor(Math.random() * FAMOUS_GHOST_NAMES.length)
                    ],
            },
        })
        console.log(`Created comment with id: ${comment.id}`)
    }
    const parentComments = await prisma.comment.findMany({
        where: { parentCommentID: null },
    })
    for (const c of parentComments) {
        const comment = await prisma.comment.create({
            data: {
                articleID: c.articleID,
                text: childComments[
                    Math.floor(Math.random() * childComments.length)
                ],
                userName:
                    FAMOUS_GHOST_NAMES[
                        Math.floor(Math.random() * FAMOUS_GHOST_NAMES.length)
                    ],
                parentCommentID: c.id,
            },
        })
        console.log(`Created child comment with id: ${comment.id}`)
    }

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
