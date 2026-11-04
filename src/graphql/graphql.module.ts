import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import type { Request } from 'express';
import depthLimit from 'graphql-depth-limit';
import { join } from 'node:path';
import { AppConfigService } from '../config/app-config.service';
import { DataLoaderModule } from '../dataloader/dataloader.module';
import { LoadersFactory } from '../dataloader/loaders.factory';
import { formatGraphQLError } from './format-error';
import type { GqlContext } from './graphql-context';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [AppConfigService, LoadersFactory],
      useFactory: (
        config: AppConfigService,
        loaders: LoadersFactory,
      ): ApolloDriverConfig => ({
        // Code-first: schema is generated from TS classes. In development it is
        // also written to schema.gql (committed as the API contract).
        autoSchemaFile:
          config.nodeEnv === 'development'
            ? join(process.cwd(), 'schema.gql')
            : true,
        sortSchema: true,
        // Apollo Sandbox instead of the deprecated GraphQL Playground,
        // enabled in every environment as the assignment requires.
        playground: false,
        introspection: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        validationRules: [depthLimit(config.graphqlMaxDepth)],
        formatError: formatGraphQLError,
        context: ({ req }: { req: Request }): GqlContext => ({
          req,
          loaders: loaders.create(),
        }),
      }),
    }),
  ],
})
export class AppGraphQLModule {}
