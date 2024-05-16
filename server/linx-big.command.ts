import { products } from '../products.json';
export class LinxBigCommand {
  static getProductsChanged = async (): Promise<any[]> => {
    const productsChanged = products;

    // if (productsChanged.error || !Array.isArray(productsChanged)) {
    //   return false;
    // }
 //const productsChangedFormated = productsChanged.map(({IDSUBPRODUTO,ean13, descricao_completa, Column3}) => {
//  return {
/// internalCodeLB: String(IDSUBPRODUTO),
/// barcodeLB: String(ean13),
/// nameLB: String(descricao_completa).trim(),
/// priceLB: formatNumberDecimalPlaces(Number(Column3)),
/// isActiveLB: true,
/// 
//  };
//});
const productsChangedFormated = productsChanged.map(({codigo_produto,codigo_barras,preco_venda}) => {
  return {
   // internalCodeLB: String(IDSUBPRODUTO),
    barcodeLB: String(codigo_produto),
    nameLB: String(codigo_barras).trim(),
    priceLB:(codigo_barras),
    isActiveLB: true,
    
  };
});
    return productsChangedFormated;
  };
}
