const { ObjectId } = require('mongodb');
const { UserInputError } = require('apollo-server-express');

const resolvers = {
  Query: {
    posts: async (_, __, { db }) => {
      try {
        return await db.collection('posts').find().toArray();
      } catch (error) {
        throw new Error('Failed to fetch posts: ' + error.message);
      }
    },
    post: async (_, { id }, { db }) => {
      try {
        if (!ObjectId.isValid(id)) {
          throw new UserInputError('Invalid post ID');
        }
        const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
        if (!post) {
          throw new UserInputError('Post not found');
        }
        return post;
      } catch (error) {
        throw new Error('Failed to fetch post: ' + error.message);
      }
    },
  },
  Mutation: {
    createPost: async (_, { title, content, author }, { db }) => {
      try {
        if (!title || title.trim() === '' || !content || content.trim() === '' || !author || author.trim() === '') {
          throw new UserInputError('Title, content, and author are required');
        }
        const post = {
          title: title.trim(),
          content: content.trim(),
          author: author.trim(),
          createdAt: new Date().toISOString(),
        };
        const result = await db.collection('posts').insertOne(post);
        return { _id: result.insertedId, ...post };
      } catch (error) {
        throw new Error('Failed to create post: ' + error.message);
      }
    },
    deletePost: async (_, { id }, { db }) => {
      try {
        if (!ObjectId.isValid(id)) {
          throw new UserInputError('Invalid post ID');
        }
        const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
        if (!post) {
          throw new UserInputError('Post not found');
        }
        await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
        return post;
      } catch (error) {
        throw new Error('Failed to delete post: ' + error.message);
      }
    },
  },
};

module.exports = resolvers;