const oracledb = require('oracledb');
const express = require('express');
const moment = require('moment'); 
const app = express();

// Inicializando o cliente Oracle
oracledb.initOracleClient({libDir: 'C:\\Users\\eduar\\Downloads\\Oracle Instant Client\\instantclient_12_2'});

// Middleware para analisar corpos de solicitação JSON
app.use(express.json());

app.post('/api/receberDadosCadastroAlteracao', async (req, res) => {
  const dados = req.body;

  // Verifique se os campos obrigatórios estão presentes
  if (!dados.cadastros) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  
  // Verifique se o usuário e a senha estão corretos
  if (dados.usuario !== 'CredorGIDEP' || dados.senha !== 'CredorUser10a20z30') {
    return res.status(401).json({ error: 'Usuário e Senha incorretos' });
  }
  
  // Verifica se o campo ITCA_CD_EVENTO tem o valor "cadastro_alteracao_int"
  if (dados.cadastros.ITCA_CD_EVENTO !== "cadastro_alteracao_int") {
    return res.status(400).json({ error: 'Requisição inválida. Verifique o campo ITCA_CD_EVENTO' });
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

    // Processando os dados de 'cadastros'
    const cadastros = dados.cadastros;

    let ITCA_DT_CRIADO_BD = moment(cadastros.ITCA_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCA_DT_INICIO = moment(cadastros.ITCA_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCA_DT_TERMINO = moment(cadastros.ITCA_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCA_DT_GERACAO = moment(cadastros.ITCA_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCA_DT_PROCESSADO = moment(cadastros.ITCA_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITCA_DT_INTERFACE = moment(cadastros.ITCA_DT_INTERFACE, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase()   
    let result = await connection.execute(
      'INSERT INTO tb_it_cadastros VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48, :49, :50, :51, :52, :53, :54, :55, :56, :57, :58, :59, :60, :61, :62, :63, :64, :65, :66, :67, :68, :69, :70, :71, :72, :73, :74, :75, :76, :77, :78, :79, :80, :81, :82, :83, :84, :85, :86, :87)',
      [cadastros.ITCA_ID_REGISTRO, cadastros.ITCA_ID_CREDOR, cadastros.ITCA_DS_CADASTRO, ITCA_DT_INICIO, ITCA_DT_TERMINO, cadastros.ITCA_CD_TERMINO, cadastros.ITCA_DS_TERMINO, cadastros.ITCA_CD_CADASTRO, ITCA_DT_CRIADO_BD, cadastros.ITCA_CD_ORIGEM, cadastros.ITCA_CD_INICIO, cadastros.ITCA_VL_CADASTRO, cadastros.ITCA_CD_MOEDA_CADASTRO, cadastros.ITCA_NR_DDD_FONE, cadastros.ITCA_NR_TELEFONE, cadastros.ITCA_NR_DDD_FONE_COM, cadastros.ITCA_NR_FONE_COM, cadastros.ITCA_NR_DDD_CEL, cadastros.ITCA_NR_CELULAR, cadastros.ITCA_DS_EMAIL, cadastros.ITCA_NR_RG, cadastros.ITCA_NR_RG_COMPLEMENTO, cadastros.ITCA_NR_CPF_CNPJ, cadastros.ITCA_NR_ALVARA, cadastros.ITCA_NR_CERTIDAO, cadastros.ITCA_DS_LOGRADOURO_TIPO, cadastros.ITCA_DS_LOGRADOURO_TITULO, cadastros.ITCA_NM_LOGRADOURO, cadastros.ITCA_NR_PREDIO, cadastros.ITCA_DS_COMPLEMENTO, cadastros.ITCA_NM_BAIRRO, cadastros.ITCA_NM_CIDADE, cadastros.ITCA_CD_ESTADO, cadastros.ITCA_CD_POSTAL, cadastros.ITCA_DS_LOGRADOURO_TIPO_C, cadastros.ITCA_DS_LOGRADOURO_TITULO_C, cadastros.ITCA_NM_LOGRADOURO_C, cadastros.ITCA_NR_PREDIO_C, cadastros.ITCA_DS_COMPLEMENTO_C, cadastros.ITCA_NM_BAIRRO_C, cadastros.ITCA_NM_CIDADE_C, cadastros.ITCA_CD_ESTADO_C, cadastros.ITCA_CD_POSTAL_C, cadastros.ITCA_NR_INSCRICAO_CADASTRO_IMO, cadastros.ITCA_DS_INSCRICAO_CADASTRO_IMO, cadastros.ITCA_CD_LOGRADOURO, cadastros.ITCA_CD_BAIRRO, cadastros.ITCA_NR_FACE, cadastros.ITCA_NR_QUADRA, cadastros.ITCA_NR_PARAMETRO, cadastros.ITCA_NR_FOLHA, cadastros.ITCA_NR_LOTE, cadastros.ITCA_DS_BLOCO, cadastros.ITCA_NR_UNIDADE, cadastros.ITCA_NR_SUB_UNIDADE, cadastros.ITCA_VL_MTQ_CONSTRUIDA, cadastros.ITCA_VL_MT_AREA, cadastros.ITCA_VL_FRACAO_IDEAL, cadastros.ITCA_VL_MT_FACE_LINEAR, cadastros.ITCA_CD_ZONA, cadastros.ITCA_DS_ZONA, cadastros.ITCA_CD_LOGRADOURO_C, cadastros.ITCA_NR_CAIXA_POSTAL, cadastros.ITCA_NR_CAIXA_POSTAL_C, cadastros.ITCA_DS_OBSERVACOES, cadastros.ITCA_CD_CNAE, cadastros.ITCA_DS_ATIVIDADE, cadastros.ITCA_NR_MEDIDOR_ENERGIA, cadastros.ITCA_NR_MEDIDOR_AGUA, cadastros.ITCA_CD_ATIVIDADE_PRINCIPAL, cadastros.ITCA_DS_REGIME, cadastros.ITCA_DS_RAMO, cadastros.ITCA_DS_OPTANTE_SIMPLES, cadastros.ITCA_CD_SITUACAO, cadastros.ITCA_DS_SITUACAO, cadastros.ITCA_NR_CONTROLE, ITCA_DT_GERACAO, cadastros.ITCA_CD_STATUS_PROCESSADO, ITCA_DT_PROCESSADO, cadastros.ITCA_CD_TIPO_RETORNO, cadastros.ITCA_DS_MENSAGEM, cadastros.ITCA_CD_EVENTO, cadastros.ITCA_CD_ENVIO, cadastros.ITCA_DS_INFORMACAO_ORIGEM, ITCA_DT_INTERFACE, cadastros.ITCA_CD_BAIRRO_C, DATA_INSERT_BANCO],
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

app.listen(3005, () => console.log('Servidor rodando na porta 3005'));
