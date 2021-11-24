const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Product = require('./resolvers/Product');
const Upload = require('./resolvers/Upload');




const prisma = new PrismaClient();
 

const server = new GraphQLServer({ typeDefs:'src/schema.graphql', resolvers: { Upload, Query, Mutation, User, Product }, context: { prisma } });
server.start(() => console.log('Server is running on http://localhost:4000'));

'{"query":"mutation ($file: Upload!) { singleUpload(file: $file) { filename\n    mimetype\n    encoding\n } }", "variables": { "file": null } }'

