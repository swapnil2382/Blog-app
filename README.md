# Blog Post Application

A simple full-stack blog application with a Node.js backend (GraphQL + MongoDB) and a Next.js frontend using Apollo Client and Tailwind CSS.

---

## Features

- Backend:
  - Node.js server with Apollo Server implementing a GraphQL API.
  - MongoDB database for storing blog posts.
  - Blog post schema with `title`, `content`, and `author` fields.
  - GraphQL queries to fetch all posts and a single post by ID.

- Frontend:
  - Next.js application with two main pages:
    - Blog post list page (displays titles and authors).
    - Blog post detail page (displays full content).
  - Apollo Client for querying the backend GraphQL API.
  - Styling with Tailwind CSS for a clean, responsive UI.

---


## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- MongoDB (local or Atlas cloud instance)

---

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```


2. Install dependencies:

```bash
npm install
```

3. Configure Apollo Client to point to your backend API URL (`http://localhost:4000/graphql` by default) in `lib/apolloClient.js`.

4. Run the frontend app:

```bash
npm run dev
```

* Open your browser and visit: `http://localhost:3000`

---

## Usage

* View all blog posts on the homepage.
* Click a post title to see the full content.
* Navigate to `/create` to add a new blog post.

---

## Technologies Used

* Backend: Node.js, Apollo Server, GraphQL, MongoDB (MongoDB Node.js driver)
* Frontend: Next.js, React, Apollo Client, Tailwind CSS
* Tools: ESLint, PostCSS, autoprefixer

