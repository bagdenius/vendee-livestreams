import {
	BadRequestException,
	Injectable,
	type PipeTransform,
} from '@nestjs/common'
import { ReadStream } from 'fs'
import { FileUpload } from 'graphql-upload/processRequest.mjs'

import { validateFileFormat, validateFileSize } from '../utils'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: FileUpload) {
		if (!value.filename) throw new BadRequestException('File not uploaded')

		const { filename, createReadStream } = value

		const fileStream = createReadStream() as ReadStream

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const

		const isFileFormatValid = validateFileFormat(filename, [...allowedFormats])
		if (!isFileFormatValid)
			throw new BadRequestException('Unsupported file format')

		const isFileSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024)
		if (!isFileSizeValid)
			throw new BadRequestException('File size should be under 10MB')

		return value
	}
}
