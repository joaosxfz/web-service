import express from "express"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swagger.js"

const app = express()

app.use(express.json())

let livros = [
    {
        id: 1,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        disponivel: true
    },
    {
        id: 2,
        titulo: "O Cortiço",
        autor: "Aluísio Azevedo",
        disponivel: true
    }
]

// =====================================================
// GET /livros
// =====================================================

/**
 * @openapi
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
app.get("/livros", (req, res) => {
    res.status(200).json(livros)
})

// =====================================================
// GET /livros/:id
// =====================================================

/**
 * @openapi
 * /livros/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 */
app.get("/livros/:id", (req, res) => {
    const id = Number(req.params.id)
    const livro = livros.find(livro => livro.id === id)

    if (!livro) {
        return res.status(404).json({
            erro: "Livro não encontrado"
        })
    }

    return res.status(200).json(livro)
})

// =====================================================
// POST /livros
// =====================================================

/**
 * @openapi
 * /livros:
 *   post:
 *     summary: Cria um novo livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - autor
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Dom Casmurro
 *               autor:
 *                 type: string
 *                 example: Machado de Assis
 *               disponivel:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
app.post("/livros", (req, res) => {
    const { titulo, autor, disponivel } = req.body

    if (typeof titulo !== "string" || titulo.trim() === "") {
        return res.status(400).json({
            erro: "O título é obrigatório e não pode estar vazio"
        })
    }

    if (titulo.trim().length > 100) {
        return res.status(400).json({
            erro: "O título deve ter no máximo 100 caracteres"
        })
    }

    if (typeof autor !== "string" || autor.trim() === "") {
        return res.status(400).json({
            erro: "O autor é obrigatório e não pode estar vazio"
        })
    }

    if (autor.trim().length > 100) {
        return res.status(400).json({
            erro: "O autor deve ter no máximo 100 caracteres"
        })
    }

    if (disponivel !== undefined && typeof disponivel !== "boolean") {
        return res.status(400).json({
            erro: "O campo disponivel deve ser booleano"
        })
    }

    const novoLivro = {
        id: livros.length + 1,
        titulo: titulo.trim(),
        autor: autor.trim(),
        disponivel: disponivel ?? true
    };

    livros.push(novoLivro)

    return res.status(201).json(novoLivro)
})

// =====================================================
// PUT /livros/:id
// =====================================================

/**
 * @openapi
 * /livros/{id}:
 *   put:
 *     summary: Atualiza um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               disponivel:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Livro não encontrado
 */
app.put("/livros/:id", (req, res) => {
    const id = Number(req.params.id)
    const livro = livros.find(livro => livro.id === id)

    if (!livro) {
        return res.status(404).json({
            erro: "Livro não encontrado"
        })
    }

    const { titulo, autor, disponivel } = req.body

    if (titulo !== undefined) {
        if (typeof titulo !== "string" || titulo.trim() === "") {
            return res.status(400).json({
                erro: "O título não pode estar vazio"
            })
        }

        if (titulo.trim().length > 100) {
            return res.status(400).json({
                erro: "O título deve ter no máximo 100 caracteres"
            })
        }

        livro.titulo = titulo.trim()
    }

    if (autor !== undefined) {
        if (typeof autor !== "string" || autor.trim() === "") {
            return res.status(400).json({
                erro: "O autor não pode estar vazio"
            })
        }

        if (autor.trim().length > 100) {
            return res.status(400).json({
                erro: "O autor deve ter no máximo 100 caracteres"
            })
        }

        livro.autor = autor.trim()
    }

    if (disponivel !== undefined) {
        if (typeof disponivel !== "boolean") {
            return res.status(400).json({
                erro: "O campo disponivel deve ser booleano"
            })
        }

        livro.disponivel = disponivel
    }

    return res.status(200).json(livro)
})

// =====================================================
// DELETE /livros/:id
// =====================================================

/**
 * @openapi
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do livro
 *     responses:
 *       204:
 *         description: Livro removido com sucesso
 *       404:
 *         description: Livro não encontrado
 */
app.delete("/livros/:id", (req, res) => {
    const id = Number(req.params.id)
    const index = livros.findIndex(livro => livro.id === id)

    if (index === -1) {
        return res.status(404).json({
            erro: "Livro não encontrado"
        })
    }

    livros.splice(index, 1)

    return res.status(204).send()
})

// =====================================================
// POST /livros/:id/emprestar
// =====================================================

/**
 * @openapi
 * /livros/{id}/emprestar:
 *   post:
 *     summary: Realiza o empréstimo de um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Livro emprestado com sucesso
 *       400:
 *         description: Livro indisponível
 *       404:
 *         description: Livro não encontrado
 */
app.post("/livros/:id/emprestar", (req, res) => {
    const id = Number(req.params.id)
    const livro = livros.find(livro => livro.id === id)

    if (!livro) {
        return res.status(404).json({
            erro: "Livro não encontrado"
        })
    }

    if (!livro.disponivel) {
        return res.status(400).json({
            erro: "Livro indisponível para empréstimo"
        })
    }

    livro.disponivel = false;

    return res.status(200).json({
        mensagem: "Livro emprestado com sucesso",
        livro
    })
})

// =====================================================
// POST /livros/:id/devolver
// =====================================================

/**
 * @openapi
 * /livros/{id}/devolver:
 *   post:
 *     summary: Realiza a devolução de um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Livro devolvido com sucesso
 *       400:
 *         description: Livro já está disponível
 *       404:
 *         description: Livro não encontrado
 */
app.post("/livros/:id/devolver", (req, res) => {
    const id = Number(req.params.id)
    const livro = livros.find(livro => livro.id === id)

    if (!livro) {
        return res.status(404).json({
            erro: "Livro não encontrado"
        })
    }

    if (livro.disponivel) {
        return res.status(400).json({
            erro: "Livro já está disponível"
        })
    }

    livro.disponivel = true

    return res.status(200).json({
        mensagem: "Livro devolvido com sucesso",
        livro
    })
})

// =====================================================
// SWAGGER
// =====================================================

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app