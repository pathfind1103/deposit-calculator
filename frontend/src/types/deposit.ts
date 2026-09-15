export interface DepositCalculationRequest {
  amount: number
  months: number
  rate: number
}

export interface DepositCalculationResponse {
  total: number
  profit: number
}

export interface ApiErrorResponse {
  status: number
  error: string
  message: string
  fieldErrors?: Record<string, string>
}

export interface DepositFormValues {
  amount: string
  months: string
  rate: string
}

export type DepositField = keyof DepositFormValues
export type DepositFormErrors = Partial<Record<DepositField, string>>
