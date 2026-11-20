import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, test } from 'vitest'
import App from './App'

test('renders the home page heading at /', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  expect(
    screen.getByRole('heading', { level: 1, name: 'MealPlan' }),
  ).toBeInTheDocument()
})

test('renders the not-found page for unknown routes', () => {
  render(
    <MemoryRouter initialEntries={['/nope']}>
      <App />
    </MemoryRouter>,
  )
  expect(
    screen.getByRole('heading', { name: 'Page not found' }),
  ).toBeInTheDocument()
})

test('defaults to the MealPlan tab and switches tabs on click', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  expect(screen.getByRole('tab', { name: 'MealPlan' })).toHaveAttribute(
    'aria-selected',
    'true',
  )

  fireEvent.click(screen.getByRole('tab', { name: 'This Week' }))
  expect(screen.getByRole('tab', { name: 'This Week' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  expect(
    screen.getByRole('heading', { level: 1, name: 'This Week' }),
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('tab', { name: 'MealPlan' }))
  expect(
    screen.getByRole('heading', { level: 1, name: 'MealPlan' }),
  ).toBeInTheDocument()
})
