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

interface AccountDeletionTemplateProps {
	domain: string
}

export function AccountDeletionTemplate({
	domain,
}: AccountDeletionTemplateProps) {
	const registerLink = `${domain}/account/create`

	return (
		<Html>
			<Head />
			<Preview>Account deleted</Preview>
			<Tailwind>
				<Body className='mx-auto max-w-2xl bg-slate-50 p-6'>
					<Section className='text-center'>
						<Heading className='text-3xl font-bold text-black'>
							Your account has been deleted
						</Heading>
						<Text className='text-base text-black mt-2'>
							Your account has been completely deleted from{' '}
							<b>VendeeLivestreams</b> platform database. All your data and
							information have been permanently deleted.
						</Text>
						<Section className='bg-white text-black rounded-lg p-6 text-center mb-4 shadow-md'>
							<Text>
								You will no longer receive Telegram and email notifications.
							</Text>
							<Text>
								If you want to return to the platform, you can register using
								the following link:
							</Text>
							<Link
								href={registerLink}
								className='inline-flex justify-center items-center mt-2 text-sm font-medium text-white bg-[#18B9AE] px-y rounded-full px-5 py-2'
							>
								Sign up on VendeeLivestream
							</Link>
						</Section>
					</Section>
					<Section className='text-center text-black'>
						<Text>
							Thank you for joining us! We're always happy to see you on our
							platform.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
