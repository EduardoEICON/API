const oracledb = require('oracledb');
const express = require('express');
const moment = require('moment'); 
const app = express();

// Inicializando o cliente Oracle
oracledb.initOracleClient({libDir: 'C:\\Users\\eduar\\Downloads\\Oracle Instant Client\\instantclient_12_2'});

// Middleware para analisar corpos de solicitação JSON
app.use(express.json());

app.post('/api/receberDadosCadastroVinculoCriacao', async (req, res) => {
  const dados = req.body;

  // Verifique se os campos obrigatórios estão presentes
  if (!dados.cadastrosPessoas) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  
  // Verifique se o usuário e a senha estão corretos
  if (dados.usuario !== 'CredorGIDEP' || dados.senha !== 'CredorUser10a20z30') {
    return res.status(401).json({ error: 'Usuário e Senha incorretos' });
  }
  
  // Verifica se o campo ITCP_CD_EVENTO tem o valor "cadastro_vinculo_criacao_int"
  if (dados.cadastrosPessoas.ITCP_CD_EVENTO !== "cadastro_vinculo_criacao_int") {
    return res.status(400).json({ error: 'Requisição inválida. Verifique o campo ITCP_CD_EVENTO' });
  }
  
  // Adicionando a data de inserção no banco
  let DATA_INSERT_BANCO = moment().format('DD-MMM-YYYY').toUpperCase();

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "giexinterface",
      password: "!795x*interface",
      connectString: "173.22.21.56:1521/giexh"
    });

    // Processando os dados de 'cadastros_pessoas'
    const cadastrosPessoas = dados.cadastrosPessoas;

    let ITCP_DT_CRIADO_BD = moment(cadastrosPessoas.ITCP_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCP_DT_INICIO = moment(cadastrosPessoas.ITCP_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCP_DT_TERMINO = moment(cadastrosPessoas.ITCP_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCP_DT_GERACAO = moment(cadastrosPessoas.ITCP_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCP_DT_PROCESSADO = moment(cadastrosPessoas.ITCP_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();  

    let result = await connection.execute(
      'INSERT INTO tb_it_cadastros_pessoas VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25)',
      [cadastrosPessoas.ITCP_ID_REGISTRO, cadastrosPessoas.ITCP_ID_CREDOR, cadastrosPessoas.ITCP_CD_CADASTRO, cadastrosPessoas.ITCP_CD_PESSOA, cadastrosPessoas.ITCP_CD_STATUS_PRINCIPAL, ITCP_DT_INICIO, ITCP_DT_TERMINO, cadastrosPessoas.ITCP_CD_TERMINO, cadastrosPessoas.ITCP_DS_TERMINO, cadastrosPessoas.ITCP_CD_VINCULO, ITCP_DT_CRIADO_BD, cadastrosPessoas.ITCP_CD_ORIGEM, cadastrosPessoas.ITCP_CD_INICIO, cadastrosPessoas.ITCP_NR_CONTROLE, cadastrosPessoas.ITCP_DS_CADASTRO, cadastrosPessoas.ITCP_DS_OBSERVACOES, ITCP_DT_GERACAO, cadastrosPessoas.ITCP_CD_STATUS_PROCESSADO, ITCP_DT_PROCESSADO, cadastrosPessoas.ITCP_CD_TIPO_RETORNO, cadastrosPessoas.ITCP_DS_MENSAGEM, cadastrosPessoas.ITCP_CD_EVENTO, cadastrosPessoas.ITCP_CD_ENVIO, cadastrosPessoas.ITCP_DS_INFORMACAO_ORIGEM, DATA_INSERT_BANCO],
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

app.listen(3007, () => console.log('Servidor rodando na porta 3007'));
