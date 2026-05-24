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

interface VerificationTemplateProps {
	domain: string
	token: string
}

export function VerificationTemplate({
	domain,
	token,
}: VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`

	return (
		<Html>
			<Head />
			<Preview>Account verification</Preview>
			<Tailwind>
				<Body className='mx-auto max-w-2xl bg-slate-50 p-6'>
					<Section className='mb-8 text-center'>
						<Heading className='text-3xl font-bold text-black'>
							Your account verification
						</Heading>
						<Text className='text-base text-black'>
							Thank you for signing up on VendeeLivestream! To verify your email
							address, please follow the link below:
						</Text>
						<Link
							href={verificationLink}
							className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'
						>
							Verify email
						</Link>
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
