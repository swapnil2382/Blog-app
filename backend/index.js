const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { connectDB, getDB } = require('./db');

async function startServer() {
  const app = express();

  // Enable CORS for Next.js frontend
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ db: getDB() }), // Ensure db is passed to resolvers
      formatError: (err) => {
        console.error('GraphQL Error:', err);
        return {
          message: err.message,
          code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
          locations: err.locations,
          path: err.path,
        };
      },
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();