import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/core/prisma'

@Injectable()
export class CategoryService {
	public constructor(private readonly prisma: PrismaService) {}

	public async getAll() {
		const categories = await this.prisma.category.findMany({
			orderBy: { createdAt: 'desc' },
			include: { streams: { include: { user: true, category: true } } },
		})
		return categories
	}

	public async getRandom() {
		const total = await this.prisma.category.count()

		const randomIndexes = new Set<number>()
		while (randomIndexes.size < 4) {
			const randomIndex = Math.floor(Math.random() * total)
			randomIndexes.add(randomIndex)
		}

		const categories = await this.prisma.category.findMany({
			include: { streams: { include: { user: true, category: true } } },
			take: total,
			skip: 0,
		})

		return Array.from(randomIndexes).map((index) => categories[index])
	}

	public async getBySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			include: { streams: { include: { user: true, category: true } } },
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}
}
