import { GraphQLScalarType, Kind, type ValueNode } from 'graphql'

type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | JsonSerializable[]
  | { [key: string]: JsonSerializable }

const parseJsonLiteral = (ast: ValueNode): JsonSerializable => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value)
    case Kind.NULL:
      return null
    case Kind.LIST:
      return ast.values.map(parseJsonLiteral)
    case Kind.OBJECT:
      return Object.fromEntries(
        ast.fields.map((field) => [field.name.value, parseJsonLiteral(field.value)]),
      )
    default:
      return null
  }
}

export const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON-compatible object, array, scalar, or null value.',
  serialize: (value: unknown) => value as JsonSerializable,
  parseValue: (value: unknown) => value as JsonSerializable,
  parseLiteral: parseJsonLiteral,
})
