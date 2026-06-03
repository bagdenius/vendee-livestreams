import type { SponsorshipPlan, User } from '@prisma/generated/client'

import type { SessionMetadata } from '@/shared/types'

export const MESSAGES = {
	welcome: `
<b>👋 Welcome to VendeeLivestreams Bot!</b>

To receive notifications and improve your platform experience, let's link your Telegram account to VendeeLivestreams.

Click the button below and go to the <b>Notifications</b> section to complete the setup.
`,

	authSuccess: `🎉 You've successfully logged in and your Telegram account is linked to VendeeLivestreams!`,

	invalidToken: `❌ Your token is invalid or expired.`,

	profile: (user: User, followersCount: number) =>
		`
<b>👤 User profile: </b>
	
👤 Username: <b>${user.username}</b>
📧 Email: <b>${user.email}</b>
👥 Followers: <b>${followersCount}</b>
📄 About: <b>${user.bio || 'Not specified'}</b>

🔧 Click the button below to open profile settings.
`,

	follows: (user: User) =>
		`📺 <a href='https://vendee-livestreams.com/${user.username}'>${user.username}</a>`,

	resetPassword: (token: string, metadata: SessionMetadata) => `
<b>🔒 Password reset</b>

You have requested a password reset for your <b>VendeeLivestreams</b> account.

To create a new password, please follow the link below:

<b><a href='https://vendee-livestreams.com/account/recovery/${token}'>Reset password</a></b>

📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

🖥️ <b>Information about request:</b>
	
• 🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}
• 📱 <b>Operating system:</b> ${metadata.device.os}
• 🌐 <b>Browser:</b> ${metadata.device.browser}
• 💻 <b>IP:</b> ${metadata.ip}

If you did not take this action please just ignore this message\n\nThank you for using <b>VendeeLivestreams</b>! 🚀
`,

	deactivate: (token: string, metadata: SessionMetadata) => `
<b>⚠️ Your account deactivation request</b>

You have initiated the deactivation process of your account on <b>VendeeLivestreams</b> platform.
To complete the transaction, please confirm your request by entering the following confirmation code:

<b>Confirmation code: ${token}</b>

📅 <b>Request date:</b> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

🖥️ <b>Information about request:</b>
	
• 🌍 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}
• 📱 <b>Operating system:</b> ${metadata.device.os}
• 🌐 <b>Browser:</b> ${metadata.device.browser}
• 💻 <b>IP:</b> ${metadata.ip}

<b>What happens after deactivation?</b>

1. You will be automatically logged out and lose access to your account.
2. If you do not cancel the deactivation within 7 days, your account will be <b>permanently deleted</b> along with all your information, data, and subscriptions.

⌛ <b>Please note:</b> If you change your mind within 7 days, you can contact our support team to restore access to your account before it is permanently deleted.

Once your account is deleted, it will be impossible to restore it, and all data will be permanently lost.

If you change your mind, simply ignore this message. Your account will remain active.

Thank you for using <b>VendeeLivestreams</b>. We are always happy to see you on our platform and hope you will stay with us. 🚀

Sincerely,
The VendeeLivestreams Team
`,

	accountDeleted: `
<b>⚠️ Your account has been completely deleted.</b>

Your account has been completely erased from the VendeeLivestreams database. All your data and information have been permanently deleted. ❌

🔒 You will no longer receive notifications on Telegram or by email.

If you wish to return to the platform, you can register using the following link:
<b><a href='https://vendee-livestreams.com/account/create'>Sign up on VendeeLivestreams</a></b>

Thank you for joining us! We look forward to seeing you again. 🚀

Sincerely,
The VendeeLivestreams Team
`,

	streamStart: (channel: User) => `
<b>📡 The ${channel.displayName} channel has started broadcasting!</b>

Watch here: <a href='https://vendee-livestream.com/${channel.username}'>Open stream</a>
`,

	newFollower: (follower: User, followersCount: number) => `
<b>You've got a new follower!</b>

This is a user <a href='https://vendee-livestreams.com/${follower.username}'>${follower.displayName}</a>

Total number of followers on your channel: ${followersCount}
`,

	newSponsorship: (plan: SponsorshipPlan, sponsor: User) => `
<b>🎉 You've got a new sponsorship!</b>

You have a new sponsor for the <b>${plan.title}</b> plan.

💰 Amount: <b>$${plan.price}</b>
👤 Sponsor: <a href='https://vendee-livestreams.com/${sponsor.username}'>${sponsor.displayName}</a>
📅 Date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>

Thank you for your work and support on the VendeeLivestreams platform!
`,

	enableTwoFactor: `
<b>🔒 Ensure your security!</b>

Enable two-factor authentication in your <a href='https://vendee-livestreams.com/dashboard/settings'>account settings</a>.
`,

	verifyChannel: `
<b>🎉 Congratulations! Your channel has been verified</b>

We're pleased to announce that your channel is now verified and you've received an official badge.

The verification badge confirms your channel's authenticity and improves viewer trust.

Thank you for joining us and continuing to grow your channel with VendeeLivestreams!
`,
}
