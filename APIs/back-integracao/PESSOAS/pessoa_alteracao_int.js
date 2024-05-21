const oracledb = require('oracledb');
const express = require('express');
const moment = require('moment'); 
const app = express();

// Inicializando o cliente Oracle
oracledb.initOracleClient({libDir: 'C:\\Users\\eduar\\Downloads\\Oracle Instant Client\\instantclient_12_2'});

// Middleware para analisar corpos de solicitação JSON
app.use(express.json());

app.post('/api/receberDadosPessoaAlteracao', async (req, res) => {
  const dados = req.body;

  // Verifique se os campos obrigatórios estão presentes
  if (!dados.pessoas) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  
  // Verifique se o usuário e a senha estão corretos
  if (dados.usuario !== 'CredorGIDEP' || dados.senha !== 'CredorUser10a20z30') {
    return res.status(401).json({ error: 'Usuário e Senha incorretos' });
  }
  
  // Verifica se o campo ITPE_CD_EVENTO tem o valor "pessoa_alteracao_int"
  if (dados.pessoas.ITPE_CD_EVENTO !== "pessoa_alteracao_int") {
    return res.status(400).json({ error: 'Requisição inválida. Verifique o campo ITPE_CD_EVENTO' });
  }
  
  // Adicionando a data de inserção no banco
  const dataInsertBanco = moment().format('DD-MMM-YYYY').toUpperCase();

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "giexinterface",
      password: "!795x*interface",
      connectString: "173.22.21.56:1521/giexh"
    });

    // Processando os dados de 'pessoas'
    const pessoas = dados.pessoas;

    let dataCriadoBD = moment(pessoas.ITPE_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let dataInicio = moment(pessoas.ITPE_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let dataAberturaNascimento = moment(pessoas.ITPE_DT_ABERTURA_NASCIMENTO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let dataEncerramentoObito = moment(pessoas.ITPE_DT_ENCERRAMENTO_OBITO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let dataTermino = moment(pessoas.ITPE_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let dataGeracao = moment(pessoas.ITPE_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let dataProcessado = moment(pessoas.ITPE_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();

    let result = await connection.execute(
      'INSERT INTO tb_it_pessoas VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48, :49, :50, :51, :52, :53, :54, :55, :56, :57, :58, :59, :60, :61, :62, :63, :64, :65, :66, :67, :68, :69, :70, :71, :72, :73, :74, :75)',
      [pessoas.ITPE_ID_REGISTRO, pessoas.ITPE_ID_CREDOR, pessoas.ITPE_DS_NOME_PESSOA, dataInicio, pessoas.ITPE_CD_PESSOA, dataAberturaNascimento, dataEncerramentoObito, pessoas.ITPE_CD_TIPO_PESSOA, dataCriadoBD, pessoas.ITPE_CD_INICIO, dataTermino, pessoas.ITPE_CD_TERMINO, pessoas.ITPE_DS_TERMINO, pessoas.ITPE_NR_DDD_FONE, pessoas.ITPE_NR_TELEFONE, pessoas.ITPE_NR_DDD_FONE_COM, pessoas.ITPE_NR_FONE_COM, pessoas.ITPE_NR_DDD_CEL, pessoas.ITPE_NR_CELULAR, pessoas.ITPE_DS_EMAIL, pessoas.ITPE_DS_RG, pessoas.ITPE_DS_RG_COMPLEMENTO, pessoas.ITPE_NR_CPF_CNPJ, pessoas.ITPE_NR_INSCR_ESTADUAL, pessoas.ITPE_NR_CART_PROFISSIONAL, pessoas.ITPE_NR_CART_PROF_SERIE, pessoas.ITPE_DS_NOME_MAE, pessoas.ITPE_NR_OAB, pessoas.ITPE_DS_OAB_UF, pessoas.ITPE_NR_CERTIDAO_OBITO, pessoas.ITPE_NR_CNH, pessoas.ITPE_DS_LOGRADOURO_TIPO, pessoas.ITPE_DS_LOGRADOURO_TITULO, pessoas.ITPE_NM_LOGRADOURO, pessoas.ITPE_NR_PREDIO, pessoas.ITPE_DS_COMPLEMENTO, pessoas.ITPE_DS_BAIRRO, pessoas.ITPE_DS_CIDADE, pessoas.ITPE_DS_SIGLA_ESTADO, pessoas.ITPE_CD_LOGRADOURO, pessoas.ITPE_CD_POSTAL, pessoas.ITPE_CD_CAIXA_POSTAL, pessoas.ITPE_DS_LOGRADOURO_TIPO_C, pessoas.ITPE_DS_LOGRADOURO_TITULO_C, pessoas.ITPE_NM_LOGRADOURO_C, pessoas.ITPE_NR_PREDIO_C, pessoas.ITPE_DS_COMPLEMENTO_C, pessoas.ITPE_DS_BAIRRO_C, pessoas.ITPE_DS_CIDADE_C, pessoas.ITPE_DS_SIGLA_ESTADO_C, pessoas.ITPE_CD_LOGRADOURO_C, pessoas.ITPE_CD_POSTAL_C, pessoas.ITPE_CD_CAIXA_POSTAL_C, pessoas.ITPE_NR_RNE, pessoas.ITPE_DS_WEBSITE, pessoas.ITPE_NR_DDD_TELEFONE_OUTRO, pessoas.ITPE_NR_FONE_OUTRO, pessoas.ITPE_DS_OBSERVACOES, pessoas.ITPE_NR_CONTROLE, pessoas.ITPE_CD_SEXO, pessoas.ITPE_DS_NOME_FANTASIA, pessoas.ITPE_NR_RG_UF, pessoas.ITPE_DS_OPTANTE_SIMPLES, dataGeracao, pessoas.ITPE_CD_STATUS_PROCESSADO, dataProcessado, pessoas.ITPE_CD_TIPO_RETORNO, pessoas.ITPE_DS_MENSAGEM, pessoas.ITPE_CD_EVENTO, pessoas.ITPE_CD_ENVIO, pessoas.ITPE_DS_INFORMACAO_ORIGEM, pessoas.ITPE_CD_BAIRRO, pessoas.ITPE_CD_BAIRRO_C, dataInsertBanco, pessoas.ITPE_DS_REGIME],
    );
    console.log("---1");
    console.log(result);
    console.log("---1");
    await connection.commit();

    res.status(200).send('Dados recebidos e processados com sucesso!');
  } catch (err) {
    console.log("---erro");
    console.log(err);
    console.log("---erro");
  } 
});

app.listen(3002, () => console.log('Servidor rodando na porta 3002'));
