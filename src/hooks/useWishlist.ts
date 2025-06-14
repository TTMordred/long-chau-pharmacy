
import { useState, useEffect } from 'react'
import type { Product } from '@/hooks/useProducts'

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('pharmacy-wishlist')
    if (savedWishlist) {
      try {
        const wishlistArray = JSON.parse(savedWishlist)
        setWishlist(new Set(wishlistArray))
      } catch (error) {
        console.error('Failed to load wishlist:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pharmacy-wishlist', JSON.stringify(Array.from(wishlist)))
  }, [wishlist])

  const addToWishlist = (productId: string) => {
    setWishlist(prev => new Set([...prev, productId]))
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev)
      newSet.delete(productId)
      return newSet
    })
  }

  const toggleWishlist = (productId: string) => {
    if (wishlist.has(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  const isInWishlist = (productId: string) => wishlist.has(productId)

  const getWishlistItems = () => Array.from(wishlist)

  const wishlistCount = wishlist.size

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistItems,
    wishlistCount
  }
}
