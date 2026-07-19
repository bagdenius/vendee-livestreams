import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/generated/client'
import { randomBytes } from 'crypto'
import { encode } from 'hi-base32'
import { TOTP } from 'otpauth'
import QRCode from 'qrcode'

import { PrismaService } from '@/core/prisma'

import { EnableTotpInput } from './inputs'

@Injectable()
export class TotpService {
	public constructor(private readonly prisma: PrismaService) {}

	public async generate(user: User) {
		const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24)

		const totp = new TOTP({
			issuer: 'VendeeLivestream',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret,
		})

		const otpAuthUrl = totp.toString()
		const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl)

		return { qrCodeUrl, secret }
	}

	public async enable(user: User, input: EnableTotpInput) {
		const { secret, pin } = input

		const totp = new TOTP({
			issuer: 'VendeeLivestream',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret,
		})

		const delta = totp.validate({ token: pin, window: 0 })
		if (delta === null) throw new BadRequestException('Wrong code')

		await this.prisma.user.update({
			where: { id: user.id },
			data: { isTotpEnabled: true, totpSecret: secret },
		})

		return true
	}

	public async disable(user: User) {
		await this.prisma.user.update({
			where: { id: user.id },
			data: { isTotpEnabled: false, totpSecret: null },
		})
		return true
	}
}
