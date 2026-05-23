import { SessionData } from 'express-session'

import { SessionMetadata } from './session-metadata.types'

export type RedisSession = SessionData & {
	cookie: SessionData['cookie']
	createdAt: string
	userId: string
	metadata: SessionMetadata
}

export type RedisSessionWithId = RedisSession & {
	id: string
}
