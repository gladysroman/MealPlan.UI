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

test('moves between tabs with arrow, Home and End keys', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  const tablist = screen.getByRole('tablist')

  fireEvent.keyDown(tablist, { key: 'ArrowRight' })
  const thisWeek = screen.getByRole('tab', { name: 'This Week' })
  expect(thisWeek).toHaveAttribute('aria-selected', 'true')
  expect(thisWeek).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'End' })
  expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'ArrowRight' })
  expect(screen.getByRole('tab', { name: 'MealPlan' })).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'ArrowLeft' })
  expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'Home' })
  expect(screen.getByRole('tab', { name: 'MealPlan' })).toHaveFocus()
})

test('only the active tab is in the tab order and each tab controls its panel', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  const tabs = screen.getAllByRole('tab')
  expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1)

  const active = screen.getByRole('tab', { selected: true })
  const panel = screen.getByRole('tabpanel')
  expect(active).toHaveAttribute('aria-controls', panel.id)
  expect(panel).toHaveAttribute('aria-labelledby', active.id)
})
