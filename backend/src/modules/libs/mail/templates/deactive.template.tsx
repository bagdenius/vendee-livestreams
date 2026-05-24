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

import { SessionMetadata } from '@/shared/types'

interface DeactivateTemplateProps {
	token: string
	metadata: SessionMetadata
}

export function DeactivateTemplate({
	token,
	metadata,
}: DeactivateTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Account deactivation</Preview>
			<Tailwind>
				<Body className='mx-auto max-w-2xl bg-slate-50 p-6'>
					<Section className='mb-8 text-center'>
						<Heading className='text-3xl font-bold text-black'>
							Your account deactivation request
						</Heading>
						<Text className='text-base text-black'>
							You have initiated the deactivation process of your account on{' '}
							<b>VendeeLivestreams</b> platform.
						</Text>
						<Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
							<Heading className='text-2xl text-black font-semibold'>
								Verification code:
							</Heading>
							<Heading className='text-3xl text-black font-semibold'>
								{token}
							</Heading>
							<Text className='text-black'>
								This code is valid for 5 minutes.
							</Text>
						</Section>
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
