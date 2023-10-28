import React from 'react'
import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  // hook lấy query param trên url
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}
