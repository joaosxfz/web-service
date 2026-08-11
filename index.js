const express = require('express');
const app = express();

app.use(express.json());

app.get('/status', (req, res) => {
    res.status(200).json({ status: 'ok - funcionou!!!!' });
});

app.get('/sobre', (req, res) => {
    res.status(200).json({
        nome: "Gabriel",
        profissao: "Professor"
    });
});

app.get('/cidade', (req, res) => {
    res.status(200).json({ cidade: "Belém" });
});

app.get('/idade', (req, res) => {
    res.status(200).json({ idade: 30 });
});

app.get('/curso', (req, res) => {
    res.status(200).json({ curso: "Informática" });
});

app.get('/escola', (req, res) => {
    res.status(200).json({ escola: "SENAI" });
});

app.get('/time', (req, res) => {
    res.status(200).json({ time: "Flamengo" });
});

app.get('/cor', (req, res) => {
    res.status(200).json({ cor: "Azul" });
});

app.get('/animal', (req, res) => {
    res.status(200).json({ animal: "Cachorro" });
});

app.get('/comida', (req, res) => {
    res.status(200).json({ comida: "Pizza" });
});

const porta = 3000;

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});

//rotas em XML

app.get('/produtos/:id/xml', (req, res) => {
    const produto = produtos.find(p => p.id === Number(req.params.id));
    if (!produto) {
        
    }
})
                 
app.put("/produtos/:id", (req, res) => {
    const produto = produtos.find((p) => p.id === Number(req.params.id));
    if (!produto) {
        return res.status(404).json({ erro: "Produto não encontrado"})
    }

    if (req?.body?.nome && req.body.nome != "") {
        produto.nome = req.body.nome
    }

    if (req?.body?.marca && req.body.marca != "")
})