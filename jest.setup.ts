import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  redirect: jest.fn(),
  useRouter: () => ({
    refresh: jest.fn()
  })
}))
