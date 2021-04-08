# jore4-frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker image

Docker image can be tested locally like this:

```bash
# build docker image
docker build -t jore4-ui:temp --build-arg NEXT_PUBLIC_GIT_HASH=example-git-hash .
# serve image in port 8080
docker run -p 8080:80 jore4-ui:temp
```
