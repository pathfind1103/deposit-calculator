import type { DepositCalculationResponse } from '../types/deposit'

interface CalculationResultProps {
  initialAmount: number
  result: DepositCalculationResponse
}

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function CalculationResult({
  initialAmount,
  result,
}: CalculationResultProps) {
  return (
    <section className="result-card" aria-live="polite" aria-labelledby="result-title">
      <h2 id="result-title">Результат</h2>

      <dl className="result-list">
        <div>
          <dt>Начальная сумма</dt>
          <dd>{currencyFormatter.format(initialAmount)}</dd>
        </div>
        <div className="total-row">
          <dt>Итоговая сумма</dt>
          <dd>{currencyFormatter.format(result.total)}</dd>
        </div>
        <div className="profit-row">
          <dt>Доход</dt>
          <dd>+{currencyFormatter.format(result.profit)}</dd>
        </div>
      </dl>
    </section>
  )
}
