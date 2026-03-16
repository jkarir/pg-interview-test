import { useState, useCallback, useRef } from 'react'
import { calculateTax } from '../lib/calculateTax'
import type { CalculatorState, TaxYear } from '../lib/types'

export function useTaxCalculator() {
  const [state, setState] = useState<CalculatorState>({ status: 'idle' })
  const lastParamsRef = useRef<{ salary: number; year: TaxYear } | null>(null)

  const calculate = useCallback(async (salary: number, year: TaxYear) => {
    lastParamsRef.current = { salary, year }
    setState({ status: 'loading' })

    try {
      const response = await fetch(`/api/tax-brackets/${year}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to fetch tax brackets')
      }

      const result = calculateTax(salary, data.tax_brackets)
      setState({ status: 'success', result })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      setState({ status: 'error', message })
    }
  }, [])

  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      calculate(lastParamsRef.current.salary, lastParamsRef.current.year)
    }
  }, [calculate])

  return { state, calculate, retry }
}
