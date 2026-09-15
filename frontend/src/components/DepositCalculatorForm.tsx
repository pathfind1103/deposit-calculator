import type { FormEvent } from 'react'
import type {
  DepositField,
  DepositFormErrors,
  DepositFormValues,
} from '../types/deposit'

interface DepositCalculatorFormProps {
  values: DepositFormValues
  errors: DepositFormErrors
  isLoading: boolean
  requestError: string | null
  onChange: (field: DepositField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function normalizeAmount(value: string): string {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  const [integerPart = '', decimalPart] = normalized.split('.', 2)
  const integer = integerPart.replace(/\D/g, '')

  if (decimalPart === undefined) {
    return integer
  }

  return `${integer}.${decimalPart.replace(/\D/g, '').slice(0, 2)}`
}

function formatAmount(value: string): string {
  if (!value) {
    return ''
  }

  const [integerPart, decimalPart] = value.split('.', 2)
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return decimalPart === undefined
    ? groupedInteger
    : `${groupedInteger},${decimalPart}`
}

export function DepositCalculatorForm({
  values,
  errors,
  isLoading,
  requestError,
  onChange,
  onSubmit,
}: DepositCalculatorFormProps) {
  return (
    <form className="calculator-form" onSubmit={onSubmit} noValidate>
      <div className="form-field">
        <div className="label-row">
          <label htmlFor="amount">Сумма вклада</label>
          <span>1 000 — 10 млн ₽</span>
        </div>
        <div className={`input-shell ${errors.amount ? 'has-error' : ''}`}>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={formatAmount(values.amount)}
            onChange={(event) => onChange('amount', normalizeAmount(event.target.value))}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
          <span className="input-unit">₽</span>
        </div>
        {errors.amount && <p className="field-error" id="amount-error">{errors.amount}</p>}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <div className="label-row">
            <label htmlFor="months">Срок</label>
            <span>1 — 60</span>
          </div>
          <div className={`input-shell ${errors.months ? 'has-error' : ''}`}>
            <input
              id="months"
              name="months"
              type="number"
              min="1"
              max="60"
              step="1"
              inputMode="numeric"
              value={values.months}
              onChange={(event) => onChange('months', event.target.value)}
              aria-invalid={Boolean(errors.months)}
              aria-describedby={errors.months ? 'months-error' : undefined}
            />
            <span className="input-unit">мес.</span>
          </div>
          {errors.months && <p className="field-error" id="months-error">{errors.months}</p>}
        </div>

        <div className="form-field">
          <div className="label-row">
            <label htmlFor="rate">Годовая ставка</label>
            <span>1 — 20%</span>
          </div>
          <div className={`input-shell ${errors.rate ? 'has-error' : ''}`}>
            <input
              id="rate"
              name="rate"
              type="number"
              min="1"
              max="20"
              step="0.01"
              inputMode="decimal"
              value={values.rate}
              onChange={(event) => onChange('rate', event.target.value)}
              aria-invalid={Boolean(errors.rate)}
              aria-describedby={errors.rate ? 'rate-error' : undefined}
            />
            <span className="input-unit">%</span>
          </div>
          {errors.rate && <p className="field-error" id="rate-error">{errors.rate}</p>}
        </div>
      </div>

      {requestError && (
        <p className="request-error" role="alert">{requestError}</p>
      )}

      <button className="calculate-button" type="submit" disabled={isLoading}>
        {isLoading ? (
          <><span className="spinner" aria-hidden="true" />Выполняем расчёт</>
        ) : (
          <>Рассчитать</>
        )}
      </button>
    </form>
  )
}
