//Importações das bibliotecas
const {test, expect, describe} = require ('@jest/globals');
const request =  require ("supertest");
const { faker } = require("@faker-js/faker/locale/pt_BR");
//Carrega as variaveis para o projeto
require('dotenv').config();

//Organiza os testes em um bloco
describe("Teste de Integração - Sinistros", () => {
    const BASE_URL = process.env.API_BASE_URL;
    const API_USER_ADMIN = process.env.API_USER_ADMIN;
    const API_PASS = process.env.API_PASS;
    const req = request(BASE_URL);
    let token;
    let sinistroId;

    // Caaso de teste
    test("Deve Autenticar na API - Usando o ADMIN", async () => {
        const dados = await req
        .post('/login')
        .send({
            credencial:API_USER_ADMIN,
            senha:API_PASS
        })
        .set('Accept','application/json');
        //Afirmação de que o status da resposta deve ser 200
        expect(dados.status).toBe(200);
        //Afirmo que na resposta esteja definado o token
        expect(dados.body.data.token).toBeDefined();
        //Armazena o token da resposta na variavel token
        token = dados.body?.data?.token;
        console.log(token);
        console.log("Status Login",dados.status, '\nLogin Body:',dados.body);
    });

    test("Deve retornar uma lista de sinistros", async () => {
        const resposta = await req 
            .get("/sinistros")
            .set('Accept','application/json')
            .set("Authorization",`Bearer ${token}`);
            
        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body.data)).toBe(true);
    });

    test("Deve retornar um sinistro com base no id", async () => {
        const resposta = await req 
            .get(`/sinistros/${sinistroId}`)
            .set('Accept','application/json')
            .set("Authorization",`Bearer ${token}`);
            
        expect(resposta.status).toBe(200);
        expect(resposta.body.data._id).toBe(sinistroId);
    });


    test("Deve atualizar um sinistro por ID", async () => {
        const sinistroAtualizado = {
            descricao: "Atualização da descrição do sinistro para teste.",
        };

        const resposta = await req
            .patch(`/sinistros/${sinistroId}`)
            .send(sinistroAtualizado)
            .set("Authorization", `Bearer ${token}`);

        expect(resposta.status).toBe(200);
        expect(resposta.body?.data?.descricao).toBe(sinistroAtualizado.descricao);
    });

    test("Deve excluir um sinistro por ID", async () => {
        const resposta = await req
            .delete(`/sinistros/${sinistroId}`)
            .set("Authorization", `Bearer ${token}`);
            
        expect(resposta.status).toBe(200);
        expect(resposta.body.message).toBe("Recurso removido com sucesso.");
    });
});


//não precisa fazer o post por calsa da imagem