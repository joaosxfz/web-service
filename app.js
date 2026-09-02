import express from "express"

import livros from "./repository/Banco.js"

const app = express()


app.use(express.json())


//Listar todos os livros 
app.get('/livros', (req, res) => {
    res.status(200).json(livros);
})

//Buscar Livro especifico 
app.get('/livros:id', (req, res) => {
    const livro = livros.find(p => p.id === Number(req.params.id));
    if (!livro) {
        return res.status(404).json({ erro: 'livro não encontrado' });
    }
    res.status(200).json(livros);
})

//criar um livro
app.post('/livros', (req, res) => {
      const id = req?.body?.id || null
    const nome = req?.body?.nome || null
    const autor = req?.body?.autor || null
    const emprestimo = req?.body?.emprestimo || null
    if (!autor) {
        res.status(400).json({ error: ' autor é obrigatorio ' })
    }
    if (!nome) {
        res.status(400).json({ error: ' nome  é obrigatorio ' })
    }
    if (!emprestimo) {
        res.status(400).json({ error: ' emprestimo é obrigatorio ' })
    }

    const novolivro = {
        id: livros.length + 1,
         nome: nome, 
         autor: autor ,
         emprestimo:emprestimo , id:id
    };

    livros.push(novolivro);
    res.status(201).json(novolivro);
})


//alterar um livro
app.put('/livros/:id', (req, res) => {
    const livro = livros.find(p => p.id === Number(req.params.id));
    if (!livro) {
        return res.status(404).json({ erro: "livro não encontrado" });
    };

    if (req?.body.autor && req.body.nome != "") {
        livro.autor = req.body.autor;
    };


    if (req?.body.nome && req.body.autor != "") {
        livro.nome = req.body.nome;
    };

 if (req?.body.emprestimo && req.body.emprestimo != "") {
        livro.emprestimo = req.body.emprestimo;
    };

    res.status(200).json(livros);
})

//deletar via ID
app.delete("/livros/:id", (req, res) => {
    const indice = livros.findIndex((p) => p.id === Number(req.params.id));
    if (indice === -1)
        return res.status(404).json({ erro: "livro não encontrado" })
    livros.splice(indice, 1);
    res.status(204).send({ message: "excluido com sucesso" });
})


export default app