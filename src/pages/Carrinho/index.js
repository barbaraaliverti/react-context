import { Button, Snackbar, InputLabel, Select, MenuItem } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useCarrinhoContext } from 'common/contexts/Carrinho';
import { usePagamentoContext } from 'common/contexts/Pagamento';
import { UsuarioContext } from 'common/contexts/Usuario';
import Produto from 'components/Produto';
import { useContext, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Voltar, TotalContainer, PagamentoContainer} from './styles';

function Carrinho() {
  const history = useHistory();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { carrinho, valorTotalCarrinho, efetuarCompra } = useCarrinhoContext();
  const { tiposPagamento, formaPagamento, mudarFormaPagamento } = usePagamentoContext();
  const { saldo = 0} = useContext(UsuarioContext);
  const saldoRestante = useMemo(() => (saldo - valorTotalCarrinho), [valorTotalCarrinho, saldo]);

  return (
    <Container>
      <Voltar 
        onClick={() => history.goBack()}
      />
      <h2>
        Carrinho
      </h2>
      {carrinho.map(produto =>
        <Produto 
          {...produto}
          key={produto.id}
        />
      )}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento </InputLabel>
        <Select
          value={formaPagamento.id}
          onChange={(evento) => mudarFormaPagamento(evento.target.value)}
        >{tiposPagamento.map( pagamento => (
          <MenuItem 
            value={pagamento.id} 
            key={pagamento.id}>
              {pagamento.nome}
            </MenuItem>)          
          )}</Select>
      </PagamentoContainer>
      <TotalContainer>
          <div>
            <h2>Total no Carrinho: </h2>
            <span>R$ {valorTotalCarrinho.toFixed(2)}</span>
          </div>
          <div>
            <h2> Saldo Atual: </h2>
            <span> R$ {Number(saldo).toFixed(2)}</span>
          </div>
          <div>
            <h2> Saldo Restante: </h2>
            <span> R$ {saldoRestante.toFixed(2)}</span>
          </div>
        </TotalContainer>
      <Button
        onClick={() => {
          efetuarCompra();
          setOpenSnackbar(true);
        }}
        color="primary"
        variant="contained"
        disabled={saldoRestante < 0 || carrinho.length === 0}
      >
        Comprar
      </Button>
        <Snackbar
          anchorOrigin={
            { 
              vertical: 'top',
              horizontal: 'right'
            }
          }
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
        >
          <MuiAlert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
          >
            Compra feita com sucesso!
          </MuiAlert>
        </Snackbar>
    </Container>
  )
}

export default Carrinho;