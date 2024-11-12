# preuv.io

Currently a proof of concept **testimonial collection and management tool** made for the [SolidHack 2024](https://hack.solidjs.com/) competition.

## Development

### 1. Install packages with pnpm

```sh
pnpm install --frozen-lockfile
```

### 2. Start the dev server

```sh
pnpm dev
```

## Supabase

The app is built using Supabase for auth, storage and db.

## Environment variables

```
VITE_JWT_SECRET=""
VITE_SUPABASE="" # url of your supabase instance
VITE_SUPABASE_ANON_KEY=""
VITE_BASE_URL="http://localhost:3000" # the root url of your app 
VITE_DB_URL="" # postgres connection string
VITE_EMAIL_CONFIRM_REDIRECT="http://localhost:3000/auth/signin" # the url and a path
VITE_SUPABASE_SERVICE_KEY="" # This key should never be exposed to clients!
```

## Deployment

Docker is used to build and start the node server. 

I'm using [coolify](https://github.com/coollabsio/coolify) to deploy it to [preuv.io](https://preuv.io) on a free tier oracle instance.

Supabase is also selfhosted and running on the same instance.

Currently using Clouflare R2 as the object storage solution.


## Future

I had to cut a lot of corners because of my very limited time during October (just look at the spaces between commits :D) and it makes me 
sad that I couldn't invest more time into this challenge.

Hopefully I'm going to gather some feedback thanks to the [SolidHack 2024](https://hack.solidjs.com/) competition which I can later use to improve this project.

I definitely need to hire a designer to tie it all together and write tests.

