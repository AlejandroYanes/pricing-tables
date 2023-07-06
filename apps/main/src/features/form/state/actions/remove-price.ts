import { useWidgetFormStore } from '../widget-state';

export function removePrice(productId: string, priceId: string) {
  const { products } = useWidgetFormStore.getState();
  const productIndex = products!.findIndex((prod) => prod.id === productId);
  const selectedProduct = products[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  const updatedPrices = selectedProduct.prices.map(p => {
    if (p.id === priceId){
      return  {
        ...p,
        isSelected: false,
      }
    };
    return  p;
  })
  products[productIndex] = { ...selectedProduct!, prices: updatedPrices };
  useWidgetFormStore.setState({ products: [...products] });
}
