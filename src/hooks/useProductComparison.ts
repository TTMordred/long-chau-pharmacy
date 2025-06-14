
import { useState, useEffect } from 'react'
import type { Product } from '@/hooks/useProducts'

export const useProductComparison = () => {
  const [comparisonList, setComparisonList] = useState<Product[]>([])

  // Load comparison list from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem('pharmacy-comparison')
    if (savedComparison) {
      try {
        const comparisonArray = JSON.parse(savedComparison)
        setComparisonList(comparisonArray)
      } catch (error) {
        console.error('Failed to load comparison list:', error)
      }
    }
  }, [])

  // Save comparison list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pharmacy-comparison', JSON.stringify(comparisonList))
  }, [comparisonList])

  const addToComparison = (product: Product) => {
    if (comparisonList.length >= 4) {
      return false // Maximum 4 products for comparison
    }
    
    if (!comparisonList.find(p => p.id === product.id)) {
      setComparisonList(prev => [...prev, product])
      return true
    }
    return false
  }

  const removeFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId))
  }

  const clearComparison = () => {
    setComparisonList([])
  }

  const isInComparison = (productId: string) => {
    return comparisonList.some(p => p.id === productId)
  }

  const comparisonCount = comparisonList.length

  return {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount
  }
}
