import { createContext, useContext, useEffect, useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';


// extraímos a função adicionarProduto pra deixar o componente CarrinhoProvider com a única função de ser o provider

export const CarrinhoProvider = ({ children }) => {

  const [ carrinho, setCarrinho ] = useState([]);
  const [ quantidadeProdutos , setQuantidadeProdutos ] = useState(0);

  return (
    <CarrinhoContext.Provider value={{ carrinho, setCarrinho , quantidadeProdutos ,  setQuantidadeProdutos}}>
      { children }
    </CarrinhoContext.Provider>
  )
}

// isso é um custom hook para externalizar a responsabilidade de mudar o contexto
export const useCarrinhoContext = () => {
  const { carrinho, setCarrinho} = useContext(CarrinhoContext);
  const { quantidadeProdutos , setQuantidadeProdutos } = useContext(CarrinhoContext);

  useEffect(() => {
    const novaQuantidade = carrinho.reduce( (contador , produto) => contador + produto.quantidade, 0);
    setQuantidadeProdutos(novaQuantidade);
    
  }, [carrinho, setQuantidadeProdutos]);

  function mudarQuantidade(id, quantidade) {
    return carrinho.map(itemDoCarrinho => {
      if(itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
      return itemDoCarrinho;
    })
  }

  function adicionarProduto(novoProduto) {
    const temOProduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id);
    if(!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho(carrinhoAnterior =>
        [...carrinhoAnterior, novoProduto]
      )
    }
    setCarrinho(mudarQuantidade(novoProduto.id, 1))
  }

  function removerProduto(id) {
    const produto = carrinho.find(itemDoCarrinho => itemDoCarrinho.id === id);
    const ultimoProduto = produto.quantidade === 1;

    if(ultimoProduto) {
      return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemDoCarrinho => itemDoCarrinho.id !== id));
    }

    setCarrinho(mudarQuantidade(id, -1))
  }

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeProdutos,
    setQuantidadeProdutos
  }
}