const bancodedados = require('../bancodedados');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const numeroDaConta = Number(numero_conta);

    const verificacaoConta = bancodedados.contas.find(conta => conta.numero === numeroDaConta);

    if (isNaN(numeroDaConta)) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor numérico são obrigatórios!" });
    }

    if (!numeroDaConta) {
        return res.status(404).json({ "mensagem": "Conta não existente!" });
    }

    if (valor <= 0) {
        return res.status(404).json({ "mensagem": "Valor informado não permitido!" });
    }

    verificacaoConta.saldo += valor;

    bancodedados.depositos.push(
        {
            data: new Date(),
            numero_conta: numeroDaConta,
            valor
        }
    );

    res.status(204).json();
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const numeroDaConta = Number(numero_conta);

    const verificacaoConta = bancodedados.contas.find(conta => conta.numero === numeroDaConta);

    if (isNaN(numeroDaConta)) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor numérico são obrigatórios!" });
    }

    if (!numeroDaConta) {
        return res.status(404).json({ "mensagem": "Conta não existente!" });
    }

    if (valor <= 0) {
        return res.status(404).json({ "mensagem": "O valor não pode ser menor que zero!" });
    }

    if (valor > verificacaoConta.saldo) {
        return res.status(404).json({ "mensagem": "Saldo indisponível!" });
    }

    if (verificacaoConta.senha === bancodedados.senha) {
        verificacaoConta.saldo -= valor;
    }

    bancodedados.saques.push(
        {
            data: new Date(),
            numero_conta: numeroDaConta,
            valor
        }
    );

    res.status(204).json();

};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const numeroDaConta1 = Number(numero_conta_origem);

    const numeroDaConta2 = Number(numero_conta_destino);

    const verificacaoConta1 = bancodedados.contas.find(conta => conta.numero === numeroDaConta1);

    const verificacaoConta2 = bancodedados.contas.find(conta => conta.numero === numeroDaConta2);

    if (isNaN(numeroDaConta1 && numeroDaConta2)) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor numérico são obrigatórios!" });
    }

    if (!verificacaoConta1) {
        return res.status(404).json({ "mensagem": "Conta origem não existente!" });
    }

    if (!verificacaoConta2) {
        return res.status(404).json({ "mensagem": "Conta destino não existente!" });
    }

    if (valor <= 0) {
        return res.status(404).json({ "mensagem": "O valor não pode ser menor que zero!" });
    }

    if (valor > verificacaoConta1.saldo) {
        return res.status(404).json({ "mensagem": "Saldo indisponível!" });
    }

    if (verificacaoConta1.senha === bancodedados.senha) {
        verificacaoConta1.saldo -= valor;
        verificacaoConta2.saldo += valor;
    }

    bancodedados.transferencias.push(
        {
            data: new Date(),
            numero_conta_origem: numeroDaConta1,
            numero_conta_destino: numeroDaConta2,
            valor
        }
    );

    res.status(204).json();

};

module.exports = {
    depositar,
    sacar,
    transferir
}