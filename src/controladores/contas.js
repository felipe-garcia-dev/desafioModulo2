const express = require('express');
const bancodedados = require('../bancodedados');

let idUnico = 1;

const listar = (req, res) => {
    res.status(200).json(bancodedados.contas);
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "Todos os campos devem ser informado!" });
    }

    const cpfUnico = bancodedados.contas.find(conta => conta.usuario.cpf === cpf);

    if (cpfUnico) {
        return res.status(400).json({ "mensagem": "CPF informado já existe!" });
    }

    const emailUnico = bancodedados.contas.find(conta => conta.usuario.email === email);

    if (emailUnico) {
        return res.status(400).json({ "mensagem": "EMAIL informado já existe!" });
    }

    const novaConta = {
        "numero": idUnico++,
        "saldo": 0,
        "usuario": {
            "nome": nome,
            "cpf": cpf,
            "data_nascimento": data_nascimento,
            "telefone": telefone,
            "email": email,
            "senha": senha
        }
    };

    bancodedados.contas.push(novaConta);

    res.status(201).json();
};


const atualizar = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const { numeroConta } = req.params;

    const numeroDaConta = Number(numeroConta);

    if (isNaN(numeroDaConta)) {
        return res.status(400).json({ "mensagem": "Número da conta não válido!" });
    }

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "Todos os campos devem ser informado!" });
    }

    const verificacaoConta = bancodedados.contas.find(conta => conta.numero === numeroDaConta);

    if (!verificacaoConta) {
        return res.status(404).json({ "mensagem": "Conta não existente!" });
    }

    const cpfUnico = bancodedados.contas.find(conta => conta.usuario.cpf === cpf);

    if (cpfUnico && verificacaoConta.numero !== numeroDaConta) {
        return res.status(400).json({ "mensagem": "CPF informado já existe!" });
    }

    const emailUnico = bancodedados.contas.find(conta => conta.usuario.email === email);

    if (emailUnico && verificacaoConta.numero !== numeroDaConta) {
        return res.status(400).json({ "mensagem": "EMAIL informado já existe!" });
    }

    verificacaoConta.usuario.nome = nome;
    verificacaoConta.usuario.cpf = cpf;
    verificacaoConta.usuario.data_nascimento = data_nascimento;
    verificacaoConta.usuario.telefone = telefone;
    verificacaoConta.usuario.email = email;
    verificacaoConta.usuario.senha = senha;

    res.status(204).json();
};

const deletar = (req, res) => {
    const { numeroConta } = req.params;

    const numeroDaConta = Number(numeroConta);

    if (isNaN(numeroDaConta)) {
        return res.status(400).json({ "mensagem": "Número da conta não válido!" });
    }

    const verificacaoConta = bancodedados.contas.find(conta => conta.numero === numeroDaConta);

    if (!verificacaoConta) {
        return res.status(404).json({ "mensagem": "Conta não existente!" });
    }

    if (verificacaoConta.saldo !== 0) {
        return res.status(403).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }

    const excluirIndex = bancodedados.contas.indexOf(verificacaoConta);

    bancodedados.contas.splice(excluirIndex, 1);

    res.status(204).json();

};

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!senha) {
        return res.status(404).json({ "mensagem": "Senha informada não é válida!" });
    }

    const verificacaoConta = bancodedados.contas.find(conta => conta.numero === Number(numero_conta));

    if (!verificacaoConta) {
        return res.status(404).json({ "mensagem": "Conta não existente!" });
    }

    if (senha !== verificacaoConta.usuario.senha) {
        return res.status(404).json({ "mensagem": "Senha informada não é válida!" });
    }

    res.status(200).json({ "saldo": verificacaoConta.saldo });
};

const extrato = (req, res) => {

    const { numero_conta, senha } = req.query;

    if (!senha) {
        return res.status(404).json({ "mensagem": "Senha informada não é válida!" });
    }

    const verificacaoConta = bancodedados.contas.find(conta => conta.numero === Number(numero_conta));

    if (!verificacaoConta) {
        return res.status(404).json({ "mensagem": "Conta não existente!" });
    }

    if (senha !== verificacaoConta.usuario.senha) {
        return res.status(404).json({ "mensagem": "Senha informada não é válida!" });
    }

    const saque = bancodedados.saques.filter((saque) => {
        return saque.numero_conta === verificacaoConta.numero;
    });

    const deposito = bancodedados.depositos.filter((deposito) => {
        return deposito.numero_conta === verificacaoConta.numero;
    });

    const transferenciasEnviadas = bancodedados.transferencias.filter((transEnv) => {
        return transEnv.numero_conta_origem === verificacaoConta.numero;
    });

    const transferenciasRecebidas = bancodedados.transferencias.filter((transRec) => {
        return transRec.numero_conta_destino === verificacaoConta.numero;
    });


    const extrato = [
        {
            saque,
            deposito,
            transferenciasEnviadas,
            transferenciasRecebidas
        }
    ]

    res.status(200).json(extrato);

};

module.exports = {
    listar,
    criarConta,
    atualizar,
    deletar,
    saldo,
    extrato,
}