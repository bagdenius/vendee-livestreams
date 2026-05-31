import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'
import { hash } from 'argon2'
import 'dotenv/config'

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		host: process.env.POSTGRES_HOST,
		port: Number(process.env.POSTGRES_PORT),
		database: process.env.POSTGRES_DATABASE,
	}),
})

async function main() {
	try {
		Logger.log('Database seeding started...')

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
		])

		const categoriesData = [
			{
				title: 'Just Chatting',
				slug: 'just-chatting',
				description:
					'Chat with your audience, share stories, react to trending topics, and connect with viewers in real time.',
				thumbnail: '/categories/just-chatting.webp',
			},
			{
				title: 'Coding',
				slug: 'coding',
				description:
					'Live programming streams featuring web development, game development, software architecture, debugging, and tech discussions.',
				thumbnail: '/categories/coding.webp',
			},
			{
				title: 'Music',
				slug: 'music',
				description:
					'Live performances, music production, DJ sets, songwriting sessions, and creative jams from talented musicians.',
				thumbnail: '/categories/music.webp',
			},
			{
				title: 'Minecraft',
				slug: 'minecraft',
				description:
					'Explore endless worlds, build incredible creations, survive dangerous adventures, and play with friends in Minecraft.',
				thumbnail: '/categories/minecraft.webp',
			},
			{
				title: 'Counter-Strike 2',
				slug: 'counter-strike-2',
				description:
					'Competitive tactical FPS gameplay featuring ranked matches, clutch moments, esports tournaments, and high-level strategy.',
				thumbnail: '/categories/counter-strike-2.webp',
			},
			{
				title: 'Valorant',
				slug: 'valorant',
				description:
					'Precision gunplay meets unique agent abilities in intense 5v5 competitive matches and esports action.',
				thumbnail: '/categories/valorant.webp',
			},
			{
				title: 'League of Legends',
				slug: 'league-of-legends',
				description:
					'Watch epic MOBA battles, ranked climbs, champion mastery, and professional League of Legends gameplay.',
				thumbnail: '/categories/league-of-legends.webp',
			},
			{
				title: 'Dota 2',
				slug: 'dota-2',
				description:
					'Strategic team-based gameplay, intense tournaments, and high-skill matches in one of the most competitive MOBAs.',
				thumbnail: '/categories/dota-2.webp',
			},
			{
				title: 'Fortnite',
				slug: 'fortnite',
				description:
					'Battle royale action, creative builds, exciting collaborations, and fast-paced multiplayer gameplay.',
				thumbnail: '/categories/fortnite.webp',
			},
			{
				title: 'Grand Theft Auto V',
				slug: 'grand-theft-auto-v',
				description:
					'Open-world chaos, roleplay servers, thrilling missions, and endless entertainment in Los Santos.',
				thumbnail: '/categories/grand-theft-auto-v.webp',
			},
			{
				title: 'Call of Duty: Warzone',
				slug: 'call-of-duty-warzone',
				description:
					'High-intensity battle royale gameplay with tactical combat, squad action, and massive firefights.',
				thumbnail: '/categories/call-of-duty-warzone.webp',
			},
			{
				title: 'Apex Legends',
				slug: 'apex-legends',
				description:
					'Fast-paced squad-based battle royale featuring unique legends, movement mechanics, and competitive action.',
				thumbnail: '/categories/apex-legends.webp',
			},
			{
				title: 'World of Warcraft',
				slug: 'world-of-warcraft',
				description:
					'Massive MMO adventures with raids, dungeons, PvP battles, and exploration across Azeroth.',
				thumbnail: '/categories/world-of-warcraft.webp',
			},
			{
				title: 'PUBG: Battlegrounds',
				slug: 'pubg-battlegrounds',
				description:
					'Realistic battle royale gameplay with survival mechanics, tactical combat, and intense firefights.',
				thumbnail: '/categories/pubg-battlegrounds.webp',
			},
			{
				title: 'Rocket League',
				slug: 'rocket-league',
				description:
					'High-speed car soccer action with competitive matches, aerial mechanics, and exciting esports moments.',
				thumbnail: '/categories/rocket-league.webp',
			},
			{
				title: 'EA Sports FC 26',
				slug: 'ea-sports-fc-26',
				description:
					'Competitive football gameplay, Ultimate Team matches, career mode streams, and online tournaments.',
				thumbnail: '/categories/ea-sports-fc-26.webp',
			},
			{
				title: 'Among Us',
				slug: 'among-us',
				description:
					'Social deduction chaos where teamwork, deception, and hilarious moments decide who survives.',
				thumbnail: '/categories/among-us.webp',
			},
			{
				title: 'Art',
				slug: 'art',
				description:
					'Creative streams featuring digital art, illustration, painting, animation, and artistic workshops.',
				thumbnail: '/categories/art.webp',
			},
			{
				title: 'Science & Technology',
				slug: 'science-and-technology',
				description:
					'Explore science, gadgets, AI, engineering, cybersecurity, and the latest innovations in technology.',
				thumbnail: '/categories/science-and-technology.webp',
			},
			{
				title: 'IRL',
				slug: 'irl',
				description:
					'Real-life streams from outdoor adventures, travel experiences, events, and everyday activities.',
				thumbnail: '/categories/irl.webp',
			},
		]
		await prisma.category.createMany({ data: categoriesData })
		Logger.log('Categories successfully loaded!')

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(
			categories.map((category) => [category.slug, category]),
		)

		const streamTitles = {
			'just-chatting': [
				'Late Night Chat with Viewers',
				'Reacting to Trending Internet Drama',
				'Talking About Life and Tech',
				'Chill Stream and Random Conversations',
				'Answering Your Questions Live',
				'Story Time: Funniest Moments Ever',
				'Hot Takes and Community Discussion',
				'Cozy Evening Stream',
			],
			coding: [
				'Building Fullstack App with Next.js and NestJS',
				'Live Coding Microservices Architecture',
				'Fixing Bugs in Production 😭',
				'Learning Rust from Scratch',
				'Building Real-time Chat with WebSockets',
				'Dockerizing My Entire Project',
				'Prisma + PostgreSQL Full Tutorial',
				'Refactoring Old Codebase Live',
				'Grinding LeetCode and System Design',
			],
			music: [
				'Late Night Piano Session',
				'Making Beats Live',
				'Lo-fi Music Production Stream',
				'Live Guitar Covers and Requests',
				'Creating EDM Track from Scratch',
				'DJ Set for Chill Vibes',
				'Singing Your Favorite Songs',
				'Mixing and Mastering Live',
			],
			minecraft: [
				'Playing Minecraft: Surviving from Zero!',
				'Building Epic Fortress in Minecraft!',
				'Hardcore Minecraft Challenge',
				'Creating Automatic Farms All Day',
				'Exploring Ancient Cities',
				'Speedrunning Minecraft with Chat',
				'100 Days Survival Challenge',
				'Building Medieval Kingdom',
				'Playing Minecraft with Subscribers',
			],
			'counter-strike-2': [
				'Faceit Grind to Level 10',
				'Clutching Every Round in CS2',
				'Road to Global Elite',
				'Playing Premier with Viewers',
				'Insane AWP Highlights',
				'Testing New CS2 Update',
				'Solo Queue Nightmare',
				'Training Aim and Movement',
				'Competitive CS2 Ranked Matches',
			],
			valorant: [
				'Grinding Ranked to Radiant',
				'Learning Every Valorant Agent',
				'Crazy Clutches and Ace Moments',
				'Playing Valorant with Subscribers',
				'Best Aim Training Routine',
				'Trying Weird Agent Combos',
				'Competitive Valorant All Day',
				'Road to Immortal',
				'Analyzing Pro Valorant Matches',
			],
			'league-of-legends': [
				'Ranked Grind to Challenger',
				'Learning Mid Lane from Scratch',
				'Playing Off-meta Champions',
				'High Elo Solo Queue',
				'Coaching Viewers Live',
				'Trying Every Champion Challenge',
				'Road to Diamond Begins',
				'Climbing with Jungle Only',
				'Watching LEC and Worlds Highlights',
			],
			'dota-2': [
				'MMR Grind All Night',
				'Learning Invoker Mechanics',
				'Playing Support Until Immortal',
				'Crazy Teamfights Compilation',
				'Road to Divine Rank',
				'Trying New Dota 2 Patch',
				'Ranked Matches with Subscribers',
				'Analyzing Pro Dota Games',
				'Hard Carry Gameplay',
			],
			fortnite: [
				'Fortnite Ranked Grind',
				'Winning Every Battle Royale',
				'Crazy Snipes Only Challenge',
				'Playing Fortnite with Viewers',
				'Testing New Fortnite Season',
				'Fastest Builds on Stream',
				'Zero Build Competitive Matches',
				'Trying Meme Strategies',
				'Late Night Fortnite Arena',
			],
			'grand-theft-auto-v': [
				'Ending GTA 5 on 100%',
				'Racing and Stunting in GTA Online',
				'Funny GTA RP Moments',
				'Grinding Money in GTA Online',
				'Police Chase Chaos',
				'Exploring the Best GTA Mods',
				'Serious Roleplay Stream',
				'Becoming Rich in GTA RP',
				'Custom Cars and Drift Session',
			],
			'call-of-duty-warzone': [
				'Warzone Ranked with Squad',
				'High Kill Gameplay Only',
				'Trying New Meta Loadouts',
				'Sniping Everyone in Verdansk',
				'Winning Back-to-Back Matches',
				'Road to Top 250',
				'Playing Warzone with Subscribers',
				'Movement King Challenge',
			],
			'apex-legends': [
				'Road to Apex Predator',
				'Learning Every Legend',
				'Fastest Movement in Apex',
				'Ranked Grind with Team',
				'Crazy 1v3 Clutches',
				'Testing New Apex Update',
				'Hot Drop Every Game',
				'Playing Apex with Viewers',
			],
			'world-of-warcraft': [
				'Mythic Raid Progression',
				'Grinding WoW Classic Hardcore',
				'PvP Arena Battles',
				'Leveling Fresh Character',
				'Farming Rare Mounts',
				'Best Gold Farming Methods',
				'Guild Raid Night',
				'Exploring New Expansion Content',
			],
			'pubg-battlegrounds': [
				'Chicken Dinner Only Challenge',
				'Solo Squad PUBG Madness',
				'Sniper Gameplay in PUBG',
				'Competitive PUBG Ranked',
				'Testing Realistic Strategies',
				'Landing Hot Zones Every Match',
				'PUBG with Subscribers',
				'Surviving Until Final Circle',
			],
			'rocket-league': [
				'Road to Grand Champion',
				'Learning Air Dribbles Live',
				'2v2 Ranked Grind',
				'Freestyle Goals Compilation',
				'Playing Rocket League with Viewers',
				'Training Advanced Mechanics',
				'Competitive Rocket League Session',
				'Trying Impossible Shots',
			],
			'ea-sports-fc-26': [
				'Ultimate Team Weekend League',
				'Opening Packs Until Icon',
				'Career Mode with Small Club',
				'Road to Division 1',
				'Best Tactics and Formations',
				'Playing FC 26 with Subscribers',
				'Building Dream Team Live',
				'Competitive FUT Champions',
			],
			'among-us': [
				'Among Us but Nobody Can Lie',
				'Funniest Impostor Moments',
				'Playing Among Us with Viewers',
				'Proximity Chat Chaos',
				'Trying Impossible Challenges',
				'Detective Skills Only',
				'Who Is the Real Impostor?',
				'Ultimate Betrayal Stream',
			],
			art: [
				'Drawing Fantasy Characters Live',
				'Digital Painting Chill Stream',
				'Learning Anime Art Style',
				'Creating Environment Concept Art',
				'Character Design from Scratch',
				'Art Requests from Chat',
				'Speedpainting Challenge',
				'Blender 3D Modeling Session',
			],
			'science-and-technology': [
				'Exploring the Future of AI',
				'Building Cool Gadgets Live',
				'Cybersecurity and Hacking Basics',
				'Talking About Space and Science',
				'Testing Weird Tech Products',
				'Machine Learning Live Demo',
				'Reacting to New Technology News',
				'Programming Robots on Stream',
			],
			irl: [
				'Walking Around the City at Night',
				'Travel Stream from Another Country',
				'IRL Food Tour Adventure',
				'Exploring Hidden Places Live',
				'Gym and Fitness IRL Stream',
				'Shopping and Talking with Chat',
				'Live Event Streaming',
				'Beach Walk and Chill Vibes',
			],
		}

		const usernames = [
			'bagdenius',
			'toxaku',
			'votizlove',
			'pixelrage',
			'ghostlynx',
			'neonphantom',
			'bytehunter',
			'darkblitz',
			'frostnova',
			'zerokage',
			'stormfury',
			'lunavex',
			'driftcore',
			'voidstriker',
			'hexarion',
			'crimsonfps',
			'astrozenn',
			'rapidpulse',
			'blazehawk',
			'cyberphantom',
			'nightshifter',
			'venombyte',
			'glitchrunner',
			'echohunter',
			'shadowwisp',
			'quantumix',
			'infernoflare',
			'velocityx',
			'vortexplay',
			'pixelshroud',
			'chaosfusion',
			'stealthnova',
			'gravitywave',
			'crypticfox',
			'mysticvolt',
			'roguepixel',
			'stormecho',
			'phantomzone',
			'zenithcore',
			'nexusflare',
			'bytewizard',
			'flamepulse',
			'silentviper',
			'moonshifter',
			'codevortex',
			'rapidshadow',
			'titanforge',
			'arcticbyte',
			'omegaunit',
			'voidlegend',
			'fireblink',
			'pixelknight',
			'digitalronin',
			'stormmatrix',
			'ghostsignal',
			'ultravex',
			'solarfury',
			'nightcrawlerx',
			'cyberdrake',
			'ironphantom',
			'epicnebula',
			'cryptoblade',
			'neonrider',
			'viperstrike',
			'alphaquest',
			'dragonshift',
			'blitzspectre',
			'hexsniper',
			'shadowcore',
			'mechaflare',
			'retrobyte',
			'starvortex',
			'atomicpixel',
			'velocityprime',
			'stormbreaker',
			'glitchhunter',
			'pixelraider',
			'firestormx',
			'zerofrost',
			'novaspectre',
		]

		const hashedPassword = await hash('12345678')

		await prisma.$transaction(async (tx) => {
			for (const username of usernames) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
						]
					]

				const userExists = await tx.user.findUnique({ where: { username } })

				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@gmail.com`,
							password: hashedPassword,
							username,
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 1,
										},
										{
											title: 'YouTube',
											url: `https://youtube.com/@${username}`,
											position: 2,
										},
									],
								},
							},
						},
					})

					const randomTitles = streamTitles[randomCategory.slug] as string[]
					const randomTitle =
						randomTitles[Math.floor(Math.random() * randomTitles.length)]

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnail: `/streams/${createdUser.username}.webp`,
							user: { connect: { id: createdUser.id } },
							category: { connect: { id: randomCategory.id } },
						},
					})

					Logger.log(
						`User "${createdUser.username}" and it's stream was created`,
					)
				}
			}
		})

		Logger.log('Database seeding completed!')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('An error occured while seeding the database')
	} finally {
		Logger.log('Closing database connection...')
		await prisma.$disconnect()
		Logger.log('Database connection closed.')
	}
}

main()
