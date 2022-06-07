import { CarrinhoProvider } from "common/contexts/Carrinho";
import { PagamentoProvider } from "common/contexts/Pagamento";
import { UsuarioProvider } from "common/contexts/Usuario";
import Carrinho from "pages/Carrinho";
import Feira from "pages/Feira";
import Login from "pages/Login";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <UsuarioProvider>
          <Route exact path="/">
            <Login />
          </Route>

          <CarrinhoProvider>
            <Route path="/feira">
              <Feira />
            </Route>

            <PagamentoProvider>
              <Route path="/carrinho">
                <Carrinho />
              </Route>
            </PagamentoProvider>
          </CarrinhoProvider>

        </UsuarioProvider>
      </Switch>
    </BrowserRouter>
  )
}

export default Router;