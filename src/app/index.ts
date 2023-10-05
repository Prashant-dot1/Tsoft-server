import express from "express";
import { ApolloServer } from '@apollo/server';
// import cors from 'cors';

import bodyParser from 'body-parser';
import cors from "cors";
import { User } from "./users";

import { expressMiddleware } from '@apollo/server/express4';
import { prismaclient } from "../client/db";
import JWTService from "../services/jwt";
import { GraphqlContext } from "../interfaces";


export async function initServer(){
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    const graphqlServer = new ApolloServer<GraphqlContext>({
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
    
    app.use('/graphql', expressMiddleware(graphqlServer, {
        context : async ( { req,res }) => {
        return {
            user : req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split("Bearer ")[1]) : undefined
        }
    }}));

    return app;

}