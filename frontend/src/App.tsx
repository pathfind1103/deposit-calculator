import { useState, type FormEvent } from 'react'
import { calculateDeposit, DepositApiError } from './api/depositCalculatorApi'
import { CalculationResult } from './components/CalculationResult'
import { DepositCalculatorForm } from './components/DepositCalculatorForm'
import type {
  DepositCalculationResponse,
  DepositField,
  DepositFormErrors,
  DepositFormValues,
} from './types/deposit'
import './App.css'

const INITIAL_VALUES: DepositFormValues = {
  amount: '100000',
  months: '12',
  rate: '8',
}

function validateForm(values: DepositFormValues): DepositFormErrors {
  const errors: DepositFormErrors = {}
  const amount = Number(values.amount)
  const months = Number(values.months)
  const rate = Number(values.rate)

  if (values.amount.trim() === '' || !Number.isFinite(amount)) {
    errors.amount = 'Введите сумму вклада'
  } else if (amount < 1000 || amount > 10_000_000) {
    errors.amount = 'Допустимая сумма — от 1 000 до 10 000 000 ₽'
  }

  if (values.months.trim() === '' || !Number.isInteger(months)) {
    errors.months = 'Укажите целое количество месяцев'
  } else if (months < 1 || months > 60) {
    errors.months = 'Допустимый срок — от 1 до 60 месяцев'
  }

  if (values.rate.trim() === '' || !Number.isFinite(rate)) {
    errors.rate = 'Введите годовую ставку'
  } else if (rate < 1 || rate > 20) {
    errors.rate = 'Допустимая ставка — от 1% до 20%'
  }

  return errors
}

function App() {
  const [values, setValues] = useState<DepositFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<DepositFormErrors>({})
  const [result, setResult] = useState<DepositCalculationResponse | null>(null)
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  const handleChange = (field: DepositField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setRequestError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validateForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const request = {
      amount: Number(values.amount),
      months: Number(values.months),
      rate: Number(values.rate),
    }

    setIsLoading(true)
    setRequestError(null)

    try {
      const calculation = await calculateDeposit(request)
      setResult(calculation)
      setCalculatedAmount(request.amount)
    } catch (error) {
      setResult(null)
      setCalculatedAmount(null)

      if (error instanceof DepositApiError) {
        setErrors(error.fieldErrors)
        setRequestError(error.message)
      } else {
        setRequestError('Не удалось выполнить расчёт. Попробуйте ещё раз.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="calculator-card" aria-labelledby="page-title">
        <header className="card-heading">
          <h1 id="page-title">Калькулятор вклада</h1>
          <p>Введите параметры для расчёта</p>
        </header>

        <DepositCalculatorForm
          values={values}
          errors={errors}
          isLoading={isLoading}
          requestError={requestError}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {result && calculatedAmount !== null && (
          <CalculationResult initialAmount={calculatedAmount} result={result} />
        )}
      </section>
    </main>
  )
}

export default App
