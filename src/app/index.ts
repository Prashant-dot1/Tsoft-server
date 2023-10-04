import express from "express";
import { ApolloServer } from '@apollo/server';
// import cors from 'cors';

import bodyParser from 'body-parser';
import cors from "cors";
import { User } from "./users";

import { expressMiddleware } from '@apollo/server/express4';
import { prismaclient } from "../client/db";



export async function initServer(){
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    const graphqlServer = new ApolloServer({
        typeDefs: `
            ${User.types}
            type Query {
                ${User.queries}
            } `,
        resolvers: {
            Query : {
                ...User.resolvers.queries
            }
        },
      });
    
    await graphqlServer.start();
    
    app.use('/graphql', expressMiddleware(graphqlServer));

    return app;

}