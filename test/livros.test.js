import request from "supertest"

import app from "../app.js"

test("POST /livros cria um novo livro", async () => {
    const resposta = await request(app).post("/livros")
        .send({ nome: "Drácula", autor: "Bram Stoker", emprestimo: "sim" })

    expect(resposta.status).toBe(201)
    expect(resposta.body.nome).toBe("Drácula")

})

test("POST /livros cria um novo livro", async () => {
    const resposta = await request(app).post("/livros")
        .send({ nome: "Drácula", autor: "Bram Stoker", emprestimo: "sim" })

    expect(resposta.status).toBe(201)
    expect(resposta.body.autor).toBe("Bram Stoker")

})


test("POST /livros cria um novo livro", async () => {
    const resposta = await request(app).post("/livros")
        .send({ nome: "Drácula", autor: "Bram Stoker", emprestimo: "sim" })

    expect(resposta.status).toBe(201)
    expect(resposta.body.emprestimo).toBe("sim")

})

test("POST /livros ao não informar o nome deve retornar mensagem obrigatorio", async () => {
    const resposta = await request(app).post("/livros")
        .send({autor: "Bram Stoker", emprestimo: "sim" })

    expect(resposta.status).toBe(400)
    expect(resposta.body.error).toBe(' nome  é obrigatorio ')

})

test("POST /livros ao não informar o nome deve retornar mensagem obrigatorio", async () => {
    const resposta = await request(app).post("/livros")
        .send({nome:"jose", emprestimo: "sim" })

    expect(resposta.status).toBe(400)
    expect(resposta.body.error).toBe(' autor é obrigatorio ')

})


test("POST /livros ao não informar o nome deve retornar mensagem obrigatorio", async () => {
    const resposta = await request(app).get("/livros")
        .send("titulo = escaravelho" )

    expect(resposta.status).toBe(400)
    expect(resposta.body.error).toBe(' emprestimo é obrigatorio ')

})



test("GET /livros ao não informar o nome deve retornar mensagem obrigatorio", async () => {
    const resposta = await request(app).get("/livros")
        .send("titulo = escaravelho")

    expect(resposta.status).toBe(200)
    expect(resposta.body[0].titulo).toBe('escaravelho do diabo')

})




test("GET /livros espera retornar 8 livros", async () => {
    const resposta = await request(app).get("/livros")
        .send()

    expect(resposta.status).toBe(200)
    expect(resposta.body.length).toBe(8)

})
