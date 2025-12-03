//Importações das bibliotecas
const { test, expect, describe } = require("@jest/globals");
const request = require("supertest");
const { faker } = require("@faker-js/faker/locale/pt_BR");
//Carrega as variaveis para o projeto
require("dotenv").config();
//Organiza os testes em um bloco
describe("Teste de Integração - Abastecimentos Frotas", () => {
  const BASE_URL = process.env.API_BASE_URL;
  const API_USER_ADMIN = process.env.API_USER_ADMIN;
  const API_PASS = process.env.API_PASS;
  const req = request(BASE_URL);
  let token;
  let abastecimentoId;
  //Caso de teste
  test("Deve Autenticar na API - Usando o ADMIN", async () => {
    const dados = await req
      .post("/login")
      .send({
        credencial: API_USER_ADMIN,
        senha: API_PASS,
      })
      .set("Accept", "application/json");
    //Afirmação de que o status da resposta deve ser 200
    expect(dados.status).toBe(200);
    //Afirmo que na resposta esteja definado o token
    expect(dados.body.data.token).toBeDefined();
    //Armazena o token da resposta na variavel token
    token = dados.body?.data?.token;
    //console.log(token);
    //console.log("Status Login",dados.status, '\nLogin Body:',dados.body);
  });

  test("Deve retornar uma lista de abastecimentos", async () => {
    const resposta = await req
      .get("/abastecimentos")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(resposta.status).toBe(200);
    abastecimentoId = resposta.body.data[0]._id;
    //console.log(resposta.body.data[0]._id);
  });
  test("Deve retornar uma abastecimento com base no id", async () => {
    const resposta = await req
      .get(`/abastecimentos/${abastecimentoId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(resposta.status).toBe(200);
    //console.log(resposta.body);
  });

  test("Deve criar um abastecimento com sucesso", async () => {
    const novoAbastecimento = {
      veiculo: "68e961273823059a4013249e",
      data_abastecimento: "2044-01-16T17:30:36.657Z",
      tipo_combustivel: "DIESEL_COMUM_S500",
      posto_combustivel: "Posto do Zé",
      litragem: 500,
      valor_total: 1000,
      valor_litro: 2.1,
      km_hora_atual: 541154,
      reserva: "68e961333823059a40134324",
    };

    const resposta = await req
      .post(`/abastecimentos`)
      .send(novoAbastecimento)
      .set("Authorization", `Bearer ${token}`);
    //console.log(resposta.body);
    expect(201);
    expect(resposta.status).toBe(201);
    expect(resposta.body.data.nome).toBe(novoAbastecimento.nome);
    abastecimentoId = resposta.body.data._id;
  });

  it("Deve atualizar um abastecimento por ID", async () => {
    const abastecimentoPatch = {
      veiculo: "68e961273823059a4013249e",
      data_abastecimento: "2044-01-16T17:30:36.657Z",
      tipo_combustivel: "DIESEL_COMUM_S500",
      posto_combustivel: "Posto do Zé",
      litragem: 500,
      valor_total: 1000,
      valor_litro: 2.1,
      km_hora_atual: 541154,
      reserva: "68e961333823059a40134324",
    };

    const dados = await req
      .patch(`/abastecimentos/${abastecimentoId}`)
      .send(abastecimentoPatch)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("content-type", /json/)
      .expect(200);

    expect(dados.status).toBe(200);
    expect(dados.body?.data?.responsavel).toEqual(
      abastecimentoPatch.responsavel
    );
    expect(dados.body?.data?.email).toEqual(abastecimentoPatch.email);
  });

  it("Deve excluir um abastecimento por ID", async () => {
    const dados = await req
      .delete(`/abastecimentos/${abastecimentoId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("content-type", /json/)
      .expect(200);
    expect(dados.status).toBe(200);
  });
});
