import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/i18n.request.ts')

const nextConfig: NextConfig = {
	reactCompiler: true,
	reactStrictMode: true,
}

export default withNextIntl(nextConfig)
