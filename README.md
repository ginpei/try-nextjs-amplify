# Try Next.js × AWS Amplify

- 🤔 [Tutorial - Connect API and database to the app - Amplify Docs](https://docs.amplify.aws/start/getting-started/data-model/q/integration/next)
- [⚡️ 5 Minute Tutorial: Deploying a NextJS app with AWS Amplify Hosting - DEV Community 👩‍💻👨‍💻](https://dev.to/dabit3/5-minute-tutorial-deploying-a-next-app-with-aws-amplify-hosting-5199)

## Set up amplify

1. Install: `npm install -g @aws-amplify/cli`
   - This CLI must be installed globally, otherwise it occurs an error
3. Set up CLI `amplify configure`

## Initialize amplify project

1. Initialize project `amplify init`
2. Add hosting: `amplify hosting add`
3. Add API (DB/auth): `amplify add api`
   - Choose "Cognito" instead of the default API key something

## Manage model

1. Open `amplify/backend/api/<app-id>/schema.graphql`
2. Modify definitions
3. Run `npm run amplify-modelgen`
4. Run `amplify push`

## Set up `amplify-modelgen`

1. Move to project root
2. Run `npx amplify-app`

## CRUD

- [DataStore - Manipulating data - Amplify Docs](https://docs.amplify.aws/lib/datastore/data-access/q/platform/js)

```ts
// Create
const post = new Post({ title });
await DataStore.save(post);

// Read
const posts = await DataStore.query(Post);

// Update
const newPost = Post.copyOf(post, (updated) =>
  Object.assign(updated, { title })
);
await DataStore.save(newPost);

// Delete
await DataStore.delete(post);
```
