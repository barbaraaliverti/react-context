import { createContext, useContext, useEffect, useState } from 'react';
import { usePagamentoContext } from './Pagamento';
import { UsuarioContext } from './Usuario';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';


// extraímos a função adicionarProduto pra deixar o componente CarrinhoProvider com a única função de ser o provider

export const CarrinhoProvider = ({ children }) => {

  const [ carrinho, setCarrinho ] = useState([]);
  const [ quantidadeProdutos , setQuantidadeProdutos ] = useState(0);
  const [ valorTotalCarrinho, setValorTotalCarrinho ] = useState(0);

  return (
    <CarrinhoContext.Provider value={{ carrinho, setCarrinho , quantidadeProdutos ,  setQuantidadeProdutos, valorTotalCarrinho, setValorTotalCarrinho}}>
      { children }
    </CarrinhoContext.Provider>
  )
}

// isso é um custom hook para externalizar a responsabilidade de mudar o contexto
export const useCarrinhoContext = () => {
  const { carrinho, setCarrinho} = useContext(CarrinhoContext);
  const { quantidadeProdutos , setQuantidadeProdutos } = useContext(CarrinhoContext);
  const { valorTotalCarrinho, setValorTotalCarrinho } = useContext(CarrinhoContext);
  const { formaPagamento } = usePagamentoContext();
  const { setSaldo } = useContext(UsuarioContext);

  useEffect(() => {
    const { novaQuantidade , novoTotal } = carrinho.reduce( (contador , produto) => (
      {
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + (produto.quantidade * produto.valor)
      }
    ), {
      novaQuantidade: 0,
      novoTotal: 0
    });
    setQuantidadeProdutos(novaQuantidade);
    setValorTotalCarrinho(novoTotal * formaPagamento.juros);    
    
  }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento]);

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

  function efetuarCompra() {
    setCarrinho([]);
    setSaldo( saldoInicial => saldoInicial - valorTotalCarrinho);
  }

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    efetuarCompra
  }
}