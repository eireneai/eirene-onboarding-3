

# EireneOnboarding3

## Getting Started

Make sure node and npm are installed on your machine.

Run `npm install --force` to install node dependencies. Force is required because we are using a specific version of effect-ts and need to install version of libraries that npm thinks are incompatible. When effect-ts is more stable/integrated with fp-ts, we'll switch back to standard versioning.

## Goals

This project is designed to introduce the following:

1) monorepos and related tooling
2) the effect-ts ecosystem
3) dependency injection aka ports and adapters
4) applications of projection/databases

## Overview

This is a distributed todo app - three seperate services come together to create a system that might be 
deployed to the cloud. We'll use the effect-ts library and algebraic datatypes to leverage the typescript type system to the maximum - every feature of typescript will utilized to verify the correctness of the application.

These services are the three apps in the `apps` folder:

1) Web UI: Allow users to view a list of all todos in the browser; periodically (re)renders a webpage based on all todos saved in the system
2) Web API: Allow users to add, update and remove todos by sending requests to an API 
3) Newsletter: Increases engagement by periodically sending an email that lists the titles of recently added todos 

These three services will communicate asynchronously via pubsub. The web API will publish events to redis pubsub and the other two services must update their own databases in response.

## Ports and Adapters

This application makes use of the ports and adapters pattern (also refered to as dependency injection):
https://8thlight.com/insights/a-color-coded-guide-to-ports-and-adapters

Ports are definitions of capabilities that we need our apps to have. For example an Id Generator, a Logger or a Repository for persisting Todos. 

Adapters are concrete implementations of the capabilities we need. For example ConsoleLogger or RedisTitlePersistence. We'll use the `Layer` abstraction from effect to model this pattern.

## Application Model

Ports are modelled in the `libs/model` folder alongside entities and events. Events and entities have the same meaning as they did in the first project.

Concrete implentations of ports live in the `libs/infra` folder. Applications are built by combining capabilites described by ports. An app is then run by providing a set of concrete implentations to use. Different combinations of implementations can be provided by add different environments in `apps/some-app/src/environments`.

This allows us to write apps that are highly testable and modular and we can run them in several different modes: stub, development, production

## Stub, Development and Production Modes

Stub mode will use stub implementations, which basically do nothing. The app will not really have any functionality. It essentially proves that the app compiles. In practice we use stubs mostly for testing, but I included it for demonstration.

Run `nx run-many --target=serve --configuration=stub` to start apps in stub mode. 

Development mode will use the implementations that require the least overhead while maintaining full functionality of the app. In this case we'll use redis for inter-service communication (similar to the event bus in the first project) and in-memory implementations where possible. 

Run `npm run docker:dev` to start development containers. 

View the `docker/docker-compose.dev.yml` for details of how the services are wired together.

Production mode will use real implentations - Mongo, Redis, BSON, etc.

Run `npm run docker:prod` to start production containers. 

View the `docker/docker-compose.dev.yml` for details of how the services are wired together.

Run `nx serve (api|newsletter|ui) --configuration=(stub|development|production)` to start a particular app with a particular configuration

## Projections

In practice, projections aren't usually a class that you instantiate like in the first project. We'll maintain our projections in the database best suited to the shape of the projection. Redis is used for keeping the list of titles for the newsletter service. Mongo is used for keeping the collection of Todos for the ui service.

## Requirements

To complete this project, fill in the gaps in implementation of this system. Anywhere you see the `NotImplemented` effect or a throw `NotImplemented` statement, provide an implementation. Typescript type definitions, code comments, and unit tests are provided for every function you need to implement. 

The longest block of code you will need to write should be around 20 lines, but many functions will only require you to write a few lines. Focus on understanding the concepts introduced and use the type definitions and unit tests to guide you.

Here are the recommended steps for completing the project:

1) Run unit tests with `nx run-many --target=test` - run these frequently to measure your progress
2) Learn about schemas and encoders/decoders by completing the implementation of `parseO` helper in `libs/core/src/lib/schema-utils.ts`
3) Use the schema library to model the `TodoAdded` event in `libs/model/src/lib/todo-added.ts`
4) Learn about development dependencies by completing the implementation of `InmemoryTitlePersistence` in `libs/infra/inmemory/src/lib/title-persistence.impl.ts`
5) Learn about handling messages from a subscription by completing the `saveTitles` effect in `apps/newsletter/src/app/app.ts` You should be able to run the applications in development mode now by running `npm run docker:dev`
6) Try sending some http requests,  `POST http://localhost:8080/todos` to create a todo, `PUT http://localhost:8080/todos/:todoId` to mark it as done, and `DELETE http://localhost:8080/todos/:todoId` to remove it.
7) Learn about the difference between live and development dependencies by completing the implementation of `MongoTodoPersistence` in `libs/infra/mongo/src/lib/todo-persistence.impl.ts`. Since it needs a real mongo instance, you'll need to test it with docker. Use `npm run docker:spec`.
8) When all tests pass, run the complete application with `npm run docker:prod` and send the same http request from step 6. 

## Conclusion

Once youre done, take a moment to observe the interactions between the different services by watching the console. Notice how sometimes the the webpage isnt in sync with its database because it hasnt been updated yet? This is called eventual consistency and its an important concept to understand when working with event driven systems. 

## Submission

To submit your work, delete the node modules folder, create a .zip archive of the project root directory and email it to your interviewer.

## Nx Stuff

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

Below are some autogenerated paragraphs about the features of Nx - its a good idea to familiarize yourself with these. Make sure to check out the nx dependency graph to understand the capabilities of nx as a build/scaffolding tool for large applications.

### Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

### Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@eirene-onboarding-3/mylib`.

### Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
