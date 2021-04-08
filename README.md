# jore4-frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Server-side rendering of Next.js is disabled as in this project it does not offer benefits wich could justify added complexity.

Next.js was still chosen over `create-react-app` as project template as it offers better tooling, better developer experience, much faster live reloads and better support for future needs.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker image

Docker image can be tested locally like this:

```bash
# optional: build builder image to support caching, so that you don't have to e.g. run yarn install from scratch every time even if dependencies have stayed the same
docker build --cache-from=jore4-ui:temp-builder --target build -t jore4-ui:temp-builder .
# build docker image and utilize cache from previous step if available
docker build -t jore4-ui:temp --cache-from=jore4-ui:temp-builder --cache-from=jore4-ui:temp .
# serve image in port 8080
docker run -p 8080:80 jore4-ui:temp
```
