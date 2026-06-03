import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'
import { hash } from 'argon2'
import 'dotenv/config'

import { CATEGORIES, STREAMS, USERNAMES } from './data'

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		host: process.env.POSTGRES_HOST,
		port: Number(process.env.POSTGRES_PORT),
		database: process.env.POSTGRES_DATABASE,
	}),
})

async function main() {
	try {
		Logger.log('Database seeding started...')

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
		])

		await prisma.category.createMany({ data: CATEGORIES })
		Logger.log('Categories successfully loaded!')

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(
			categories.map((category) => [category.slug, category]),
		)

		const hashedPassword = await hash('12345678')

		await prisma.$transaction(async (tx) => {
			for (const username of USERNAMES) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
						]
					]

				const userExists = await tx.user.findUnique({ where: { username } })

				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@gmail.com`,
							password: hashedPassword,
							username,
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 1,
										},
										{
											title: 'YouTube',
											url: `https://youtube.com/@${username}`,
											position: 2,
										},
									],
								},
							},
							notificationSettings: { create: {} },
						},
					})

					const randomTitles = STREAMS[randomCategory.slug] as string[]
					const randomTitle =
						randomTitles[Math.floor(Math.random() * randomTitles.length)]

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnail: `/streams/${createdUser.username}.webp`,
							user: { connect: { id: createdUser.id } },
							category: { connect: { id: randomCategory.id } },
						},
					})

					Logger.log(
						`User "${createdUser.username}" and it's stream was created`,
					)
				}
			}
		})

		Logger.log('Database seeding completed!')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('An error occured while seeding the database')
	} finally {
		Logger.log('Closing database connection...')
		await prisma.$disconnect()
		Logger.log('Database connection closed.')
	}
}

main()
