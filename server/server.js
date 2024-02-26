import express from 'express'
import http from 'http'
import {ApolloServer} from "@apollo/server"
import cors from 'cors'
import bodyParser from 'body-parser'
import {expressMiddleware} from "@apollo/server/express4"
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer"

import {typeDefs, resolvers} from "./src/schema.js";

const startApolloServer = async (typeDefs, resolvers) => {
    const app = express()

    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})]})

    await server.start()

    // 800ms delay to everything to test optimistic updates
    app.use((req, res, next) => {
        setTimeout(next, 1000);
    });

    app.use(
        '/graphql', cors(), bodyParser.json(),
        expressMiddleware(server, {
            context: async ({req}) => ({token: req.headers.token})
        })
    )

    await new Promise(resolve => httpServer.listen({port: 4000}, resolve))

    console.log(`Server ready at http://localhost:4000/graphql`)

}

startApolloServer(typeDefs,resolvers)