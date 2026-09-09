import request from "supertest"
import app from "../app.js"

describe("GET /livros", () => {
    test("deve listar os livros", async () => {
        const resposta = await request(app).get("/livros")

        expect(resposta.status).toBe(200)
        expect(Array.isArray(resposta.body)).toBe(true)
    })
})

describe("GET /livros/:id", () => {
    test("deve retornar um livro existente", async () => {
        const resposta = await request(app).get("/livros/1");

        expect(resposta.status).toBe(200)
        expect(resposta.body.id).toBe(1)
    })

    test("deve retornar 404 para livro inexistente", async () => {
        const resposta = await request(app).get("/livros/999")

        expect(resposta.status).toBe(404)
    })
})

describe("POST /livros", () => {
    test("deve criar livro com disponivel informado", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "Livro Teste",
                autor: "Autor Teste",
                disponivel: false
            })

        expect(resposta.status).toBe(201)
        expect(resposta.body.disponivel).toBe(false)
    })

    test("deve criar livro com disponivel padrão true", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "Livro Sem Disponibilidade",
                autor: "Autor Teste"
            })

        expect(resposta.status).toBe(201)
        expect(resposta.body.disponivel).toBe(true)
    })

    test("não deve aceitar título vazio", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "",
                autor: "Autor"
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar título só com espaços", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "   ",
                autor: "Autor"
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar título maior que 100 caracteres", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "a".repeat(101),
                autor: "Autor"
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar autor vazio", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "Livro",
                autor: ""
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar autor só com espaços", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "Livro",
                autor: "   "
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar autor maior que 100 caracteres", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "Livro",
                autor: "a".repeat(101)
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar disponivel diferente de booleano", async () => {
        const resposta = await request(app)
            .post("/livros")
            .send({
                titulo: "Livro",
                autor: "Autor",
                disponivel: "true"
            })

        expect(resposta.status).toBe(400)
    })
})

describe("PUT /livros/:id", () => {
    test("deve atualizar todos os campos", async () => {
        const resposta = await request(app)
            .put("/livros/1")
            .send({
                titulo: "Título Atualizado",
                autor: "Autor Atualizado",
                disponivel: false
            })

        expect(resposta.status).toBe(200)
        expect(resposta.body.titulo).toBe("Título Atualizado")
        expect(resposta.body.autor).toBe("Autor Atualizado")
        expect(resposta.body.disponivel).toBe(false)
    })

    test("deve atualizar apenas o título", async () => {
        const resposta = await request(app)
            .put("/livros/1")
            .send({
                titulo: "Outro Título"
            })

        expect(resposta.status).toBe(200)
        expect(resposta.body.titulo).toBe("Outro Título")
    })

    test("não deve atualizar livro inexistente", async () => {
        const resposta = await request(app)
            .put("/livros/999")
            .send({
                titulo: "Teste"
            })

        expect(resposta.status).toBe(404)
    })

    test("não deve aceitar título vazio no PUT", async () => {
        const resposta = await request(app)
            .put("/livros/1")
            .send({
                titulo: ""
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar título maior que 100 caracteres no PUT", async () => {
        const resposta = await request(app)
            .put("/livros/1")
            .send({
                titulo: "a".repeat(101)
            })

        expect(resposta.status).toBe(400);
    })

    test("não deve aceitar autor vazio no PUT", async () => {
        const resposta = await request(app)
            .put("/livros/1")
            .send({
                autor: ""
            });

        expect(resposta.status).toBe(400);
    })

    test("não deve aceitar autor maior que 100 caracteres no PUT", async () => {
        const resposta = await request(app)
            .put("/livros/1")
            .send({
                autor: "a".repeat(101)
            })

        expect(resposta.status).toBe(400)
    })

    test("não deve aceitar disponivel inválido no PUT", async () => {
        const resposta = await request(app)
            .put("/livros/1")
            .send({
                disponivel: "false"
            })

        expect(resposta.status).toBe(400)
    })
})

describe("Empréstimo e devolução", () => {
    test("deve retornar 404 ao emprestar livro inexistente", async () => {
        const resposta = await request(app)
            .post("/livros/999/emprestar")

        expect(resposta.status).toBe(404)
    })

    test("deve emprestar um livro disponível", async () => {
        await request(app)
            .put("/livros/2")
            .send({ disponivel: true })

        const resposta = await request(app)
            .post("/livros/2/emprestar")

        expect(resposta.status).toBe(200)
        expect(resposta.body.livro.disponivel).toBe(false)
    })

    test("não deve emprestar livro indisponível", async () => {
        const resposta = await request(app)
            .post("/livros/2/emprestar")

        expect(resposta.status).toBe(400)
    })

    test("deve retornar 404 ao devolver livro inexistente", async () => {
        const resposta = await request(app)
            .post("/livros/999/devolver")

        expect(resposta.status).toBe(404)
    })

    test("deve devolver livro emprestado", async () => {
        const resposta = await request(app)
            .post("/livros/2/devolver")

        expect(resposta.status).toBe(200)
        expect(resposta.body.livro.disponivel).toBe(true)
    })

    test("não deve devolver livro já disponível", async () => {
        const resposta = await request(app)
            .post("/livros/2/devolver")

        expect(resposta.status).toBe(400)
    })
})

describe("DELETE /livros/:id", () => {
    test("não deve remover livro inexistente", async () => {
        const resposta = await request(app).delete("/livros/999")

        expect(resposta.status).toBe(404)
    })

    test("deve remover um livro existente", async () => {
        const resposta = await request(app).delete("/livros/1")

        expect(resposta.status).toBe(204)
    })
})