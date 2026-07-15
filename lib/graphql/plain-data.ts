type PlainData =
  | string
  | number
  | boolean
  | null
  | PlainData[]
  | { [key: string]: PlainData }

const isPrimitivePlainData = (value: unknown): value is string | number | boolean => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

const isPlainRecordLike = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

const hasJsonSerializer = (value: unknown): value is { toJSON: () => unknown } => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as { toJSON?: unknown }

  return typeof candidate.toJSON === 'function'
}

const formatPath = (path: string) => path || '<root>'

const getValueTypeName = (value: unknown) => {
  if (value === null) {
    return 'null'
  }

  if (typeof value !== 'object') {
    return typeof value
  }

  return value.constructor?.name ?? 'object-without-constructor'
}

const toClientSafePlainDataInternal = (
  value: unknown,
  path: string,
  seen: WeakSet<object>,
): PlainData => {
  if (value === null || value === undefined) {
    return null
  }

  if (isPrimitivePlainData(value)) {
    return Number.isNaN(value) ? null : value
  }

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      toClientSafePlainDataInternal(item, `${path}[${index}]`, seen),
    )
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (hasJsonSerializer(value)) {
    return toClientSafePlainDataInternal(value.toJSON(), path, seen)
  }

  if (isPlainRecordLike(value)) {
    if (seen.has(value)) {
      throw new Error(`GraphQL result contains a circular reference at ${formatPath(path)}.`)
    }

    seen.add(value)

    const entries = Object.entries(value).flatMap(([key, item]) => {
      if (item === undefined) {
        return []
      }

      return [
        [
          key,
          toClientSafePlainDataInternal(
            item,
            path ? `${path}.${key}` : key,
            seen,
          ),
        ] as const,
      ]
    })

    seen.delete(value)

    return Object.fromEntries(entries)
  }

  throw new Error(
    `GraphQL result contains a value that cannot be serialized for Client Components at ${formatPath(path)}. Value type: ${getValueTypeName(value)}.`,
  )
}

export const toClientSafePlainData = (value: unknown): PlainData => {
  return toClientSafePlainDataInternal(value, '', new WeakSet<object>())
}

export const toTypedClientSafePlainData = <TData>(value: TData): TData => {
  return toClientSafePlainData(value) as TData
}
