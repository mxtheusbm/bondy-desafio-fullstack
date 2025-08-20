import typeDefs from '../typeDefs'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled'
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda'
import { buildSubgraphSchema } from '@apollo/subgraph'
import resolvers from './resolvers'
import { connection } from '../memoryDB/connection'

const { NODE_ENV = 'local' } = process.env

const schema = buildSubgraphSchema({ typeDefs, resolvers })

const requestHandler = handlers.createAPIGatewayProxyEventRequestHandler()

const apolloServer = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginInlineTraceDisabled()],
  includeStacktraceInErrorResponses: true,
  status400ForVariableCoercionErrors: true,
  introspection: true,
})

const buildContext = startServerAndCreateLambdaHandler(
  apolloServer,
  requestHandler,
  {
    context: async ({ event, context }) => {
      context.callbackWaitsForEmptyEventLoop = false
      console.log(`Connected in ${NODE_ENV} environment`)
      await connection()

      const authHeader =
        event.headers?.authorization || event.headers?.Authorization || ''
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null

      return {
        token,
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
      }
    },
  }
)

export default buildContext
