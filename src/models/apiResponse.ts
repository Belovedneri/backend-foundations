// apiResponse.ts
// This defines a GENERIC type — a type that takes another type as a
// parameter, similar to how a function can take a value as a parameter.
// The <T> here is a placeholder: whoever USES this type later decides
// what T actually is.

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}