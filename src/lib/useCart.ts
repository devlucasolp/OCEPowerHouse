import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Product } from '../types/product';
import type { Coupon, CouponApplication } from '../types/coupon';
import { applyCoupon } from './couponUtils';
import { calculateCartShipping } from './productUtils';

// Estendendo o tipo Product para incluir quantity
export type CartProduct = Product & { quantity: number };

// Funções utilitárias centralizadas para o carrinho
const toSafeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? 0 : num;
};

const toSafeQuantity = (value: any): number => {
  const num = Number(value);
  return isNaN(num) || num < 1 ? 1 : Math.floor(num);
};

const roundToTwoDecimals = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

const calculateItemTotal = (price: any, quantity: any): number => {
  const safePrice = toSafeNumber(price);
  const safeQuantity = toSafeQuantity(quantity);
  return roundToTwoDecimals(safePrice * safeQuantity);
};

const calculateCartTotal = (items: CartProduct[]): number => {
  const total = items.reduce((acc, item) => {
    return acc + calculateItemTotal(item.price, item.quantity);
  }, 0);
  return roundToTwoDecimals(total);
};

const calculateTotalItems = (items: CartProduct[]): number => {
  return items.reduce((acc, item) => {
    return acc + toSafeQuantity(item.quantity);
  }, 0);
};

// Função para normalizar dados do produto
const normalizeProductForCart = (product: Product): CartProduct => {
  return {
    ...product,
    price: toSafeNumber(product.price), // Usa o preço já definido (pode ser o finalPrice)
    quantity: 1,
    _id: product._id || product.id || '',
    id: product.id || product._id || '',
  };
};

// Função para limpar localStorage corrompido
const clearCorruptedStorage = () => {
  try {
    localStorage.removeItem('cart-storage');
    console.log('🧹 localStorage do carrinho limpo');
  } catch (e) {
    console.error('Erro ao limpar localStorage:', e);
  }
};

type CartState = {
  cartItems: CartProduct[];
  isCartOpen: boolean;
  totalPrice: number;
  totalItems: number;
  appliedCoupon: CouponApplication | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  finalTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCouponToCart: (coupon: Coupon) => boolean;
  removeCoupon: () => void;
  updateShippingCost: (cost: number) => void; // Nova função
};

export const useCart = create<CartState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        cartItems: [],
        isCartOpen: false,
        totalPrice: 0,
        totalItems: 0,
        appliedCoupon: null,
        subtotal: 0,
        shippingCost: 0,
        discountAmount: 0,
        finalTotal: 0,
        
        addToCart: (product) =>
          set((state) => {
            // Forçar limpeza se carrinho estiver corrompido
            if (!Array.isArray(state.cartItems)) {
              clearCorruptedStorage();
              state.cartItems = [];
            }
            
            const normalizedProduct = normalizeProductForCart(product);
            const productId = normalizedProduct.id || normalizedProduct._id;
            
            const existingItemIndex = state.cartItems.findIndex(
              (item) => (item.id || item._id) === productId
            );
            
            let newCartItems: CartProduct[];
            
            if (existingItemIndex >= 0) {
              const updatedItems = [...state.cartItems];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + 1
              };
              newCartItems = updatedItems;
            } else {
              newCartItems = [...state.cartItems, normalizedProduct];
            }
            
            const subtotal = calculateCartTotal(newCartItems);
            const totalItems = calculateTotalItems(newCartItems);
            const shippingCost = calculateCartShipping(newCartItems);
            
            // Recalcular cupom se aplicado
            let newAppliedCoupon = state.appliedCoupon;
            let discountAmount = 0;
            let finalTotal = subtotal + shippingCost;
            
            if (state.appliedCoupon) {
              const couponResult = applyCoupon(state.appliedCoupon.coupon, newCartItems, subtotal);
              if (couponResult) {
                newAppliedCoupon = couponResult;
                discountAmount = couponResult.discountAmount;
                finalTotal = couponResult.finalPrice + shippingCost;
              } else {
                newAppliedCoupon = null;
              }
            }
            
            return {
              cartItems: newCartItems,
              isCartOpen: true,
              totalPrice: subtotal,
              totalItems,
              subtotal,
              shippingCost,
              discountAmount,
              finalTotal,
              appliedCoupon: newAppliedCoupon,
            };
          }),
          
        removeFromCart: (productId) =>
          set((state) => {
            const newCartItems = state.cartItems.filter((item) => (item.id || item._id) !== productId);
            const subtotal = calculateCartTotal(newCartItems);
            const totalItems = calculateTotalItems(newCartItems);
            const shippingCost = calculateCartShipping(newCartItems);
            
            // Recalcular cupom se aplicado
            let newAppliedCoupon = state.appliedCoupon;
            let discountAmount = 0;
            let finalTotal = subtotal + shippingCost;
            
            if (state.appliedCoupon) {
              const couponResult = applyCoupon(state.appliedCoupon.coupon, newCartItems, subtotal);
              if (couponResult) {
                newAppliedCoupon = couponResult;
                discountAmount = couponResult.discountAmount;
                finalTotal = couponResult.finalPrice + shippingCost;
              } else {
                newAppliedCoupon = null;
              }
            }
            
            return {
              cartItems: newCartItems,
              totalPrice: subtotal,
              totalItems,
              subtotal,
              shippingCost,
              discountAmount,
              finalTotal,
              appliedCoupon: newAppliedCoupon,
            };
          }),
          
        updateQuantity: (productId, quantity) =>
          set((state) => {
            const safeQuantity = toSafeQuantity(quantity);
            
            let newCartItems: CartProduct[];
            
            if (safeQuantity < 1) {
              newCartItems = state.cartItems.filter((item) => (item.id || item._id) !== productId);
            } else {
              newCartItems = state.cartItems.map((item) =>
                (item.id || item._id) === productId 
                  ? { ...item, quantity: safeQuantity }
                  : item
              );
            }
            
            const subtotal = calculateCartTotal(newCartItems);
            const totalItems = calculateTotalItems(newCartItems);
            const shippingCost = calculateCartShipping(newCartItems);
            
            // Recalcular cupom se aplicado
            let newAppliedCoupon = state.appliedCoupon;
            let discountAmount = 0;
            let finalTotal = subtotal + shippingCost;
            
            if (state.appliedCoupon) {
              const couponResult = applyCoupon(state.appliedCoupon.coupon, newCartItems, subtotal);
              if (couponResult) {
                newAppliedCoupon = couponResult;
                discountAmount = couponResult.discountAmount;
                finalTotal = couponResult.finalPrice + shippingCost;
              } else {
                newAppliedCoupon = null;
              }
            }
            
            return {
              cartItems: newCartItems,
              totalPrice: subtotal,
              totalItems,
              subtotal,
              shippingCost,
              discountAmount,
              finalTotal,
              appliedCoupon: newAppliedCoupon,
            };
          }),
          
        clearCart: () => set({ 
          cartItems: [], 
          totalPrice: 0, 
          totalItems: 0,
          appliedCoupon: null,
          subtotal: 0,
          shippingCost: 0,
          discountAmount: 0,
          finalTotal: 0,
        }),
        
        openCart: () => set({ isCartOpen: true }),
        closeCart: () => set({ isCartOpen: false }),
        
        applyCouponToCart: (coupon: Coupon) => {
          console.log('🔧 DEBUG useCart: applyCouponToCart chamado', {
            couponCode: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
          });
          
          const state = get();
          console.log('🔧 DEBUG useCart: Estado atual', {
            cartItemsCount: state.cartItems.length,
            subtotal: state.subtotal,
            currentCoupon: state.appliedCoupon?.coupon?.code || 'nenhum'
          });
          
          const couponResult = applyCoupon(coupon, state.cartItems, state.subtotal);
          console.log('🔧 DEBUG useCart: Resultado applyCoupon', couponResult);
          
          if (couponResult) {
            console.log('🔧 DEBUG useCart: Aplicando cupom - novo estado', {
              discountAmount: couponResult.discountAmount,
              finalPrice: couponResult.finalPrice,
              oldTotal: state.subtotal
            });
            
            set({
              appliedCoupon: couponResult,
              discountAmount: couponResult.discountAmount,
              finalTotal: couponResult.finalPrice + state.shippingCost,
            });
            
            console.log('✅ DEBUG useCart: Cupom aplicado com sucesso!');
            return true;
          }
          
          console.log('❌ DEBUG useCart: Falha ao aplicar cupom');
          return false;
        },
        
        removeCoupon: () => {
          const state = get();
          set({
            appliedCoupon: null,
            discountAmount: 0,
            finalTotal: state.subtotal + state.shippingCost,
          });
        },
        updateShippingCost: (cost: number) => {
          set((state) => {
            const newShippingCost = toSafeNumber(cost);
            const newFinalTotal = roundToTwoDecimals(
              state.subtotal + newShippingCost - state.discountAmount
            );
            
            return {
              ...state,
              shippingCost: newShippingCost,
              finalTotal: newFinalTotal
            };
          });
        },
      }),
      { 
        name: 'cart-storage',
        partialize: (state) => ({ 
          cartItems: Array.isArray(state.cartItems) ? state.cartItems : [],
          totalPrice: state.totalPrice || 0,
          totalItems: state.totalItems || 0,
          appliedCoupon: state.appliedCoupon,
          subtotal: state.subtotal || 0,
          shippingCost: state.shippingCost || 0,
          discountAmount: state.discountAmount || 0,
          finalTotal: state.finalTotal || 0,
        }),
        version: 10, // Incrementei a versão para incluir frete
        merge: (persistedState, currentState) => {
          if (persistedState && typeof persistedState === 'object' && 'cartItems' in persistedState) {
            const cartItems = Array.isArray(persistedState.cartItems) ? persistedState.cartItems : [];
            const subtotal = calculateCartTotal(cartItems);
            const shippingCost = calculateCartShipping(cartItems);
            
            return {
              ...currentState,
              cartItems,
              totalPrice: subtotal,
              totalItems: calculateTotalItems(cartItems),
              subtotal,
              shippingCost,
              appliedCoupon: (persistedState as any).appliedCoupon || null,
              discountAmount: (persistedState as any).discountAmount || 0,
              finalTotal: (persistedState as any).finalTotal || (subtotal + shippingCost),
            };
          }
          return currentState;
        }
      }
    )
  )
);

// Exportar funções utilitárias para uso em outros componentes
export { 
  toSafeNumber, 
  toSafeQuantity, 
  roundToTwoDecimals, 
  calculateItemTotal, 
  calculateCartTotal 
};