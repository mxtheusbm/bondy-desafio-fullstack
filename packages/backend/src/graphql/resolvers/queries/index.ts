import { GraphQLResolveInfo } from 'graphql'
import { me } from './me'

export default {
  me: (parent: any, args: any, context: any, info: GraphQLResolveInfo) =>
    me(parent, args, context, info),
}
