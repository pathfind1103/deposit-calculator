import type {
  ApiErrorResponse,
  DepositCalculationRequest,
  DepositCalculationResponse,
  DepositFormErrors,
} from '../types/deposit'

const CALCULATE_ENDPOINT = '/api/calculate'

export class DepositApiError extends Error {
  readonly fieldErrors: DepositFormErrors

  constructor(
    message: string,
    fieldErrors: DepositFormErrors = {},
  ) {
    super(message)
    this.name = 'DepositApiError'
    this.fieldErrors = fieldErrors
  }
}

export async function calculateDeposit(
  request: DepositCalculationRequest,
): Promise<DepositCalculationResponse> {
  let response: Response

  try {
    response = await fetch(CALCULATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
  } catch {
    throw new DepositApiError(
      'Сервер недоступен. Проверьте, что backend запущен.',
    )
  }

  if (!response.ok) {
    const errorResponse = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null

    throw new DepositApiError(
      errorResponse?.message ?? 'Сервер не смог выполнить расчёт.',
      errorResponse?.fieldErrors ?? {},
    )
  }

  return (await response.json()) as DepositCalculationResponse
}
