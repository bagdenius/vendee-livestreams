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

export function VerifyChannelTemplate() {
	return (
		<Html>
			<Head />
			<Preview>Your channel has been verified</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black mt-2'>
							Congratulations! Your channel has been verified
						</Heading>
						<Text className='text-black text-base mt-2'>
							We're pleased to announce that your channel is now verified and
							you've received an official badge.
						</Text>
					</Section>
					<Section className='bg-white rounded-lg shadow-md p-6 text-center mb-6'>
						<Heading className='text-2xl text-black font-semibold'>
							What does it mean?
						</Heading>
						<Text className='text-base text-black mt-2'>
							The verification badge confirms your channel's authenticity and
							improves viewer trust.
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
