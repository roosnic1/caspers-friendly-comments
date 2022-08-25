import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const articleData: Prisma.ArticleCreateInput[] = [
    {
        title: 'Article 1',
        content: 'Hello this is an article',
    },
    {
        title: 'Article 2',
        content: 'Hello this is another article',
    },
    {
        title: 'Article 3',
        content: 'Hello this is the third article',
    },
]

async function main() {
    console.log(`Start seeding ...`)
    for (const a of articleData) {
        const article = await prisma.article.create({
            data: a,
        })
        console.log(`Created user with id: ${article.id}`)
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
