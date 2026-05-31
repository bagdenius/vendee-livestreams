import { Args, Query, Resolver } from '@nestjs/graphql'

import { CategoryService } from './category.service'
import { CategoryModel } from './models'

@Resolver('Category')
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], { name: 'getCategories' })
	public async getAll() {
		return this.categoryService.getAll()
	}

	@Query(() => [CategoryModel], { name: 'getRandomCategories' })
	public async getRandom() {
		return this.categoryService.getRandom()
	}

	@Query(() => CategoryModel, { name: 'getCategoryBySlug' })
	public async getBySlug(@Args('slug') slug: string) {
		return this.categoryService.getBySlug(slug)
	}
}
