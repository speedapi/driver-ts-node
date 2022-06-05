<img align="right" width="128" src="https://github.com/speedapi/info/blob/master/logos/logo_color.png?raw=true">

![License](https://img.shields.io/github/license/speedapi/driver-ts-node)
![Version](https://img.shields.io/npm/v/@speedapi/node)
![Coverage](https://coveralls.io/repos/github/speedapi/driver-ts-node/badge.svg?branch=master)
![Downloads](https://img.shields.io/npm/dt/@speedapi/node)
![Size](https://img.shields.io/bundlephobia/minzip/@speedapi/node)
![PRs and issues](https://img.shields.io/badge/PRs%20and%20issues-welcome-brightgreen)

# SpeedAPI Node.JS transport
This library provides a SpeedAPI transport level implementation for the Node.JS runtime. Install it with:
```console
npm i @speedapi/node
```

And check out [the main package](https://www.npmjs.com/package/@speedapi/driver) for its installation instructions.

# What is SpeedAPI?
It's a platform-agnostic API and serialization tool specifically geared towards high-throughput realtime applications. You can read more about its features [here](https://github.com/speedapi/info)

# How do I use it?
There's a complete tutorial over [here](https://github.com/speedapi/info/tree/master/speedapi-tutorial).

## What are the exported classes?
`*Client`, `*Server` and `*Listener`, where `*` is each of `Tcp`, `Tls` and `Ws` (WebSocket)
  - Clients are supposed to be instantiated on the client side;
  - Listeners are supposed to be instantiated on the server side;
  - Servers are instantiated by Listeners for each connection and passed to you via a callback.

# Testing
**Warning**: this repository uses a `pnpm` lock file, hence you can't substitute it for `npm` below.
```
git clone https://github.com/speedapi/driver-ts
cd driver-ts
pnpm i
pip3 install susc
pnpm test
```
