require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { Post } from './entities/Post'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import { COOKIE_NAME, __prod__ } from './constants'
import { Context } from './types/Context'
import { PostResolver } from './resolvers/post'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import cors from 'cors'
import { Upvote } from './entities/Upvote'
import { buildDataLoaders } from './utils/dataLoaders'

const main = async () => {
	const connection = await createConnection({
		type: 'postgres',
		database: 'reddit',
		username: process.env.DB_USERNAME_DEV,
		password: process.env.DB_PASSWORD_DEV,
		logging: true,
		synchronize: true,
		entities: [User, Post, Upvote]
	})

	const app = express()

	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true
		})
	)

	// Session/Cookie store
	const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@reddit.d1jnu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
	await mongoose.connect(mongoUrl, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})

	console.log('MongoDB Connected')

	app.use(
		session({
			name: COOKIE_NAME,
			store: MongoStore.create({ mongoUrl }),
			cookie: {
				maxAge: 1000 * 60 * 60, // one hour
				httpOnly: true, // JS front end cannot access the cookie
				secure: __prod__, // cookie only works in https
				sameSite: 'lax' // protection against CSRF
			},
			secret: process.env.SESSION_SECRET_DEV_PROD as string,
			saveUninitialized: false, // don't save empty sessions, right from the start
			resave: false
		})
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, UserResolver, PostResolver],
			validate: false
		}),
		context: ({ req, res }): Context => ({
			req,
			res,
			connection,
			dataLoaders: buildDataLoaders()
		}),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
	})

	await apolloServer.start()

	apolloServer.applyMiddleware({ app, cors: false })

	const PORT = process.env.PORT || 4000
	app.listen(PORT, () =>
		console.log(
			`Server started on port ${PORT}. GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`
		)
	)
}

main().catch(error => console.log(error))
