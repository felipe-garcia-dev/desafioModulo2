const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.json({ "mensagem": "A senha do banco não informada!" });
    }

    if (senha_banco !== 'Cubos123Bank') {
        return res.status(404).json({ "mensagem": "A senha do banco informada é inválida!" });
    }

    next();
}

module.exports = {
    validarSenha
}