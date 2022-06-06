import { createContext, useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export const CarrinhoProvider = ({ children }) => {

  const [ carrinho, setCarrinho ] = useState([]);

  function adicionarProduto(novoProduto) {
    const temOProduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id);
    if(!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho(carrinhoAnterior =>
        [...carrinhoAnterior, novoProduto]
      )
    }
    setCarrinho(carrinhoAnterior => carrinhoAnterior.map(itemDoCarrinho => {
      if(itemDoCarrinho.id === novoProduto.id) itemDoCarrinho.quantidade += 1;
      return itemDoCarrinho;
    }))
  }

  return (
    <CarrinhoContext.Provider value={{ carrinho, setCarrinho, adicionarProduto }}>
      { children }
    </CarrinhoContext.Provider>
  )
}