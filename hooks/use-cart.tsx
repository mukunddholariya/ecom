"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage"
import { getProductById } from "@/lib/data"
import type { Cart, CartItem, CartTotals } from "@/types/cart"

const EMPTY_CART: Cart = { items: [] }

const emptySubscribe = () => () => {}

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

function computeTotals(cart: Cart): CartTotals {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  // Free delivery above ₹499
  const deliveryCharge = subtotal >= 499 || subtotal === 0 ? 0 : 49
  const total = subtotal + deliveryCharge

  const totalSavings = cart.items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)

  return { itemCount, subtotal, deliveryCharge, total, totalSavings }
}

function loadInitialCart(): Cart {
  const saved = getStorage<Cart>(STORAGE_KEYS.CART)
  if (!saved || !Array.isArray(saved.items)) return EMPTY_CART

  const revalidatedItems: CartItem[] = []
  for (const item of saved.items) {
    const liveProduct = getProductById(item.productId)
    if (liveProduct) {
      const maxStock = liveProduct.stock ?? 99
      if (maxStock > 0) {
        revalidatedItems.push({
          ...item,
          price: liveProduct.price,
          originalPrice: liveProduct.originalPrice,
          stock: maxStock,
          name: liveProduct.name,
          image: liveProduct.images[0] ?? item.image,
          slug: liveProduct.slug,
          quantity: Math.min(Math.max(1, item.quantity), maxStock),
        })
      }
    }
  }
  return { items: revalidatedItems }
}

interface CartContextValue {
  cart: Cart
  totals: CartTotals
  isLoaded: boolean
  isCartSheetOpen: boolean
  openCartSheet: () => void
  closeCartSheet: () => void
  setIsCartSheetOpen: (open: boolean) => void
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  removeItem: (productId: string, variantLabel?: string) => void
  updateQuantity: (
    productId: string,
    quantity: number,
    variantLabel?: string,
  ) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => loadInitialCart())
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  const isLoaded = useIsMounted()

  // Persist to storage whenever cart changes after client mount
  useEffect(() => {
    setStorage(STORAGE_KEYS.CART, cart)
  }, [cart])

  const openCartSheet = useCallback(() => setIsCartSheetOpen(true), [])
  const closeCartSheet = useCallback(() => setIsCartSheetOpen(false), [])

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity">, qty = 1) => {
      const liveProduct = getProductById(newItem.productId)
      const stockLimit = liveProduct ? liveProduct.stock : (newItem.stock ?? 99)

      if (stockLimit <= 0) return

      setCart((prev) => {
        const existingIndex = prev.items.findIndex(
          (i) =>
            i.productId === newItem.productId &&
            i.variantLabel === newItem.variantLabel,
        )

        if (existingIndex > -1) {
          const currentQty = prev.items[existingIndex].quantity
          const newQty = Math.min(currentQty + qty, stockLimit)

          const nextItems = [...prev.items]
          nextItems[existingIndex] = {
            ...nextItems[existingIndex],
            quantity: newQty,
            stock: stockLimit,
          }
          return { items: nextItems }
        }

        const initialQty = Math.min(qty, stockLimit)
        return {
          items: [
            ...prev.items,
            {
              ...newItem,
              quantity: initialQty,
              stock: stockLimit,
            },
          ],
        }
      })
    },
    [],
  )

  const removeItem = useCallback(
    (productId: string, variantLabel?: string) => {
      setCart((prev) => ({
        items: prev.items.filter(
          (i) =>
            !(
              i.productId === productId && i.variantLabel === variantLabel
            ),
        ),
      }))
    },
    [],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantLabel?: string) => {
      if (quantity <= 0) {
        removeItem(productId, variantLabel)
        return
      }

      const liveProduct = getProductById(productId)
      const maxStock = liveProduct ? liveProduct.stock : 99
      const clampedQty = Math.min(quantity, maxStock)

      setCart((prev) => ({
        items: prev.items.map((i) =>
          i.productId === productId && i.variantLabel === variantLabel
            ? { ...i, quantity: clampedQty, stock: maxStock }
            : i,
        ),
      }))
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setCart(EMPTY_CART)
  }, [])

  const totals = useMemo(() => computeTotals(cart), [cart])

  const contextValue = useMemo(
    () => ({
      cart,
      totals,
      isLoaded,
      isCartSheetOpen,
      openCartSheet,
      closeCartSheet,
      setIsCartSheetOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      cart,
      totals,
      isLoaded,
      isCartSheetOpen,
      openCartSheet,
      closeCartSheet,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  )

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
