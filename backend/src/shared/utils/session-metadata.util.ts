import DeviceDetector from 'device-detector-js'
import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import countries from 'i18n-iso-countries'
import countriesEnLocale from 'i18n-iso-countries/langs/en.json'

import type { SessionMetadata } from '../types'

import { IS_DEV_ENV } from './is-dev.util'

countries.registerLocale(countriesEnLocale)

export function getSessionMetadata(
	req: Request,
	userAgent: string,
): SessionMetadata {
	const ip = IS_DEV_ENV
		? '162.210.194.35'
		: Array.isArray(req.headers['cf-connecting-ip'])
			? req.headers['cf-connecting-ip'][0]
			: req.headers['cf-connecting-ip'] ||
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]
					: req.ip || 'unknown')

	const location = lookup(ip)
	const device = new DeviceDetector().parse(userAgent)

	return {
		location: {
			country: countries.getName(location?.country || '', 'en') || 'Unknown',
			city: location?.city || 'Unknown',
			latitude: location?.ll.at(0) || 0,
			longitute: location?.ll.at(1) || 0,
		},
		device: {
			browser: device.client?.name || 'Unknown',
			os: device.os?.name || 'Unknown',
			type: device.device?.type || 'Unknown',
		},
		ip,
	}
}
