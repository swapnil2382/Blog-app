const { gql } = require('apollo-server-express');

const typeDefs = gql`
  """
  Represents a blog post in the system
  """
  type BlogPost {
    _id: ID!
    title: String!
    content: String!
    author: String!
    createdAt: String!
  }

  """
  Queries for retrieving blog posts
  """
  type Query {
    """
    Fetch all blog posts
    """
    posts: [BlogPost!]!
    """
    Fetch a single blog post by ID
    """
    post(id: ID!): BlogPost
  }

  """
  Mutations for modifying blog posts
  """
  type Mutation {
    """
    Create a new blog post
    """
    createPost(title: String!, content: String!, author: String!): BlogPost!
    """
    Delete a blog post by ID
    """
    deletePost(id: ID!): BlogPost!
  }
`;

module.exports = typeDefs;