import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'
import React from 'react'

import type { SessionMetadata } from '@/shared/types'

interface PasswordRecoveryTemplateProps {
	domain: string
	token: string
	metadata: SessionMetadata
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	metadata,
}: PasswordRecoveryTemplateProps) {
	const resetLink = `${domain}/account/recovery/${token}`

	return (
		<Html>
			<Head />
			<Preview>Password recovery</Preview>
			<Tailwind>
				<Body className='mx-auto max-w-2xl bg-slate-50 p-6'>
					<Section className='mb-8 text-center'>
						<Heading className='text-3xl font-bold text-black'>
							Your account password recovery
						</Heading>
						<Text className='text-base text-black'>
							You have requested a password reset for your account.
						</Text>
						<Text className='text-base text-black'>
							To reset your password click the link below
						</Text>
						<Link
							href={resetLink}
							className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'
						>
							Reset password
						</Link>
					</Section>
					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading className='text-xl font-semibold text-[#18B9AE]'>
							Information about request
						</Heading>
						<ul className='list-disc list-inside mt-2 text-black'>
							<li>
								🌍 Location: {metadata.location.country},{' '}
								{metadata.location.city}
							</li>
							<li>📱 Operating system: {metadata.device.os}</li>
							<li>🌐 Browser: {metadata.device.browser}</li>
							<li>💻 IP: {metadata.ip}</li>
						</ul>
						<Text className='text-gray-600 mt-2'>
							If you did not take this action please just ignore this message
						</Text>
					</Section>
					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							If you have any questions or encounter any difficulties, please do
							not hesitate to contact our support team at{' '}
							<Link
								href='mailto:help@vendee.com'
								className='text-[#18B9AE] underline'
							>
								help@vendee.com
							</Link>
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
