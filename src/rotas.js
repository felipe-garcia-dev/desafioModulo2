const { Router } = require('express');
const { listar, criarConta, atualizar, deletar, saldo, extrato } = require('./controladores/contas');
const { depositar, sacar, transferir } = require('./controladores/transacoes');
const { validarSenha } = require('./intermediarios');



const rotas = Router();

rotas.get('/contas', validarSenha, listar);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizar);
rotas.delete('/contas/:numeroConta', deletar);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);

module.exports = rotas;
