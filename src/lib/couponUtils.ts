import type { Coupon, CouponValidationResult, CouponApplication } from '../types/coupon';
import type { Product } from '../types/product';
import type { CartProduct } from './useCart';

/**
 * Valida se um cupom pode ser usado
 */
export const validateCoupon = (
  coupon: Coupon,
  cartItems: CartProduct[],
  totalAmount: number
): CouponValidationResult => {
  // Verificar se o cupom está ativo
  if (!coupon.isActive) {
    return { isValid: false, error: 'Cupom não está ativo' };
  }

  // Verificar data de início
  if (coupon.startDate && new Date() < new Date(coupon.startDate)) {
    return { isValid: false, error: 'Cupom ainda não está válido' };
  }

  // Verificar data de expiração
  if (coupon.endDate && new Date() > new Date(coupon.endDate)) {
    return { isValid: false, error: 'Cupom expirado' };
  }

  // Verificar limite de uso
  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
    return { isValid: false, error: 'Cupom esgotado' };
  }

  // Verificar valor mínimo da compra
  if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
    return { 
      isValid: false, 
      error: `Valor mínimo da compra: R$ ${coupon.minPurchaseAmount.toFixed(2)}` 
    };
  }

  // Verificar categorias aplicáveis
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const hasApplicableCategory = cartItems.some(item => 
      coupon.applicableCategories!.includes(item.category)
    );
    if (!hasApplicableCategory) {
      return { isValid: false, error: 'Cupom não se aplica aos produtos no carrinho' };
    }
  }

  // Verificar produtos excluídos
  if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
    const hasExcludedProduct = cartItems.some(item => 
      coupon.excludedProducts!.includes(item._id || item.id || '')
    );
    if (hasExcludedProduct) {
      return { isValid: false, error: 'Alguns produtos no carrinho não permitem este cupom' };
    }
  }

  return { isValid: true };
};

/**
 * Calcula o desconto que um cupom aplicaria
 */
export const calculateDiscount = (
  coupon: Coupon,
  cartItems: CartProduct[],
  totalAmount: number
): number => {
  const validation = validateCoupon(coupon, cartItems, totalAmount);
  if (!validation.isValid) {
    return 0;
  }

  let discount = 0;

  if (coupon.discountType === 'percentage') {
    // Desconto percentual
    discount = (totalAmount * coupon.discountValue) / 100;
    
    // Aplicar limite máximo se definido
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    // Desconto fixo
    discount = coupon.discountValue;
    
    // Não pode descontar mais que o total
    if (discount > totalAmount) {
      discount = totalAmount;
    }
  }

  return Math.round(discount * 100) / 100; // Arredondar para 2 casas decimais
};

/**
 * Aplica um cupom ao carrinho
 */
export const applyCoupon = (
  coupon: Coupon,
  cartItems: CartProduct[],
  totalAmount: number
): CouponApplication | null => {
  const validation = validateCoupon(coupon, cartItems, totalAmount);
  if (!validation.isValid) {
    return null;
  }

  const discountAmount = calculateDiscount(coupon, cartItems, totalAmount);
  const finalPrice = Math.max(0, totalAmount - discountAmount);

  return {
    coupon,
    discountAmount,
    finalPrice: Math.round(finalPrice * 100) / 100
  };
};

/**
 * Busca cupons aplicáveis a um produto específico
 */
export const getApplicableCoupons = (product: Product): Coupon[] => {
  return product.applicableCoupons || [];
};

/**
 * Formata o desconto para exibição
 */
export const formatDiscount = (coupon: Coupon): string => {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}% OFF`;
  } else {
    return `R$ ${coupon.discountValue.toFixed(2)} OFF`;
  }
};

/**
 * Verifica se um cupom está válido para uso
 */
export const isCouponValid = (coupon: Coupon): boolean => {
  const now = new Date();
  
  // Verificar se está ativo
  if (!coupon.isActive) return false;
  
  // Verificar datas
  if (coupon.startDate && now < new Date(coupon.startDate)) return false;
  if (coupon.endDate && now > new Date(coupon.endDate)) return false;
  
  // Verificar limite de uso
  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) return false;
  
  return true;
}; 