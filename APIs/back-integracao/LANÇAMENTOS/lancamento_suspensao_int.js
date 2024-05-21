const oracledb = require('oracledb');
const express = require('express');
const moment = require('moment'); 
const app = express();

// Inicializando o cliente Oracle
oracledb.initOracleClient({libDir: 'C:\\Users\\eduar\\Downloads\\Oracle Instant Client\\instantclient_12_2'});

// Middleware para analisar corpos de solicitação JSON
app.use(express.json());

app.post('/api/receberDadosLancamentoSuspensao', async (req, res) => {
  const dados = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "giexinterface",
      password: "!795x*interface",
      connectString: "173.22.21.56:1521/giexh"
    });

    // Definindo o valor de DATA_INSERT_BANCO como o momento atual
    const DATA_INSERT_BANCO = moment().format('DD-MMM-YYYY').toUpperCase();
    
    // Verifique se o usuário e a senha estão corretos
	  if (dados.usuario !== 'CredorGIDEP' || dados.senha !== 'CredorUser10a20z30') {
      return res.status(401).json({ error: 'Usuário e Senha incorretos' });
    }

    // Verificando se os eventos são "lancamento_suspensao_int" antes de inserir os dados
    if (dados.lancamentos.ITLA_CD_EVENTO !== 'lancamento_suspensao_int') {
      throw new Error('O evento de lancamentos não é "lancamento_suspensao_int"');
    }

    // Processando os dados de 'lancamentos'
    const lancamentos = dados.lancamentos;

    let ITLA_DT_TERMINO = moment(lancamentos.ITLA_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_CRIADO_BD = moment(lancamentos.ITLA_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_INICIO = moment(lancamentos.ITLA_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_VENCIMENTO = moment(lancamentos.ITLA_DT_VENCIMENTO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_INSCRICAO = moment(lancamentos.ITLA_DT_INSCRICAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_MIGRACAO = moment(lancamentos.ITLA_DT_MIGRACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_GERACAO = moment(lancamentos.ITLA_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_PROCESSADO = moment(lancamentos.ITLA_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITLA_DT_REINICIA_VALIDADE = moment(lancamentos.ITLA_DT_REINICIA_VALIDADE, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    
    let result = await connection.execute(
      'INSERT INTO tb_it_lancamentos VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48, :49, :50, :51, :52, :53, :54, :55, :56, :57, :58, :59, :60, :61, :62, :63, :64, :65, :66, :67)',
      [lancamentos.ITLA_ID_REGISTRO, lancamentos.ITLA_ID_CREDOR, lancamentos.ITLA_CD_INICIO, ITLA_DT_TERMINO, lancamentos.ITLA_CD_TERMINO, lancamentos.ITLA_DS_TERMINO, ITLA_DT_CRIADO_BD, lancamentos.ITLA_CD_LANCAMENTO, lancamentos.ITLA_CD_CADASTRO, lancamentos.ITLA_NR_EXERCICIO_LANCAMENTO, lancamentos.ITLA_CD_TIPO_LANCAMENTO, lancamentos.ITLA_NR_LANCAMENTO, lancamentos.ITLA_CD_ORIGEM, lancamentos.ITLA_CD_MOEDA_ORIGINAL, lancamentos.ITLA_VL_ORIGINAL, lancamentos.ITLA_VL_SALDO, ITLA_DT_INICIO, ITLA_DT_VENCIMENTO, lancamentos.ITLA_NR_MES_LANCAMENTO, lancamentos.ITLA_NR_NOTIFICACAO, lancamentos.ITLA_NR_PARCELAS, lancamentos.ITLA_NR_FOLHA, lancamentos.ITLA_NR_VOLUME, lancamentos.ITLA_NM_LIVRO, lancamentos.ITLA_DS_LIVRO, lancamentos.ITLA_CD_SITUACAO, lancamentos.ITLA_CD_FASE, ITLA_DT_INSCRICAO, lancamentos.ITLA_NR_EXERCICIO_CERTIDAO, lancamentos.ITLA_NR_CERTIDAO, lancamentos.ITLA_NR_PROCESSO_ORDEM, lancamentos.ITLA_NR_EXERCICIO_ORDEM, lancamentos.ITLA_NR_VARA, lancamentos.ITLA_NR_PROCESSO_ADM, lancamentos.ITLA_NR_EXERCICIO_ADM, lancamentos.ITLA_NR_INSCRICAO, lancamentos.ITLA_VL_INSCRITO, lancamentos.ITLA_CD_MOEDA_INSCRITO, lancamentos.ITLA_VL_MIGRACAO_PRINCIPAL, lancamentos.ITLA_VL_MIGRACAO_MULTA, lancamentos.ITLA_VL_MIGRACAO_JUROS, lancamentos.ITLA_VL_MIGRACAO_CORRECAO, lancamentos.ITLA_VL_MIGRACAO_TOTAL, ITLA_DT_MIGRACAO, lancamentos.ITLA_CD_MOEDA_MIGRACAO, lancamentos.ITLA_DS_CADASTRO, lancamentos.ITLA_CD_PROCESSO, lancamentos.ITLA_DS_OBSERVACOES, lancamentos.ITLA_NR_CONTROLE, lancamentos.ITLA_CD_DESPESA_PROCESSO, lancamentos.ITLA_NR_ORDEM, ITLA_DT_GERACAO, lancamentos.ITLA_CD_STATUS_PROCESSADO, ITLA_DT_PROCESSADO, lancamentos.ITLA_CD_TIPO_RETORNO, lancamentos.ITLA_DS_MENSAGEM, lancamentos.ITLA_CD_EVENTO, lancamentos.ITLA_CD_ENVIO, lancamentos.ITLA_DS_INFORMACAO_ORIGEM, lancamentos.ITLA_VL_MULTA_PRE_EXISTENTE, lancamentos.ITLA_VL_JUROS_PRE_EXISTENTE, lancamentos.ITLP_ST_UNICA, lancamentos.ITLA_NR_PROC_ADM_APURACAO, lancamentos.ITLA_NR_EXER_PROC_ADM_APUR, ITLA_DT_REINICIA_VALIDADE, lancamentos.ITLA_DT_EXIGIBILIDADE, DATA_INSERT_BANCO],
    );
    console.log("---1");
    console.log(result);
    console.log("---1");
    await connection.commit();

    // Verificando se os eventos são "lancamento_suspensao_int" antes de inserir os dados de 'lancamentosParcelas'
    if (Array.isArray(dados.lancamentos.lancamentosParcelas)) {
      if (!dados.lancamentos.lancamentosParcelas.every(parcela => parcela.ITLP_CD_EVENTO === 'lancamento_suspensao_int')) {
        throw new Error('O evento de lancamentosParcelas não é "lancamento_suspensao_int"');
      }
    }

    // Processando os dados de 'lancamentosParcelas'
    const lancamentosParcelas = dados.lancamentos.lancamentosParcelas;

    // Se 'lancamentosParcelas' for um array, iterar sobre ele
    if (Array.isArray(dados.lancamentos.lancamentosParcelas)) {
      await Promise.all(dados.lancamentos.lancamentosParcelas.map(async (parcela, index) => {
        // Processando os dados das parcelas
        const ITLP_DT_MIGRACAO = moment(parcela.ITLP_DT_MIGRACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_VENCIMENTO = moment(parcela.ITLP_DT_VENCIMENTO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_CRIADO_BD = moment(parcela.ITLP_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_INICIO = moment(parcela.ITLP_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_TERMINO = moment(parcela.ITLP_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_GERACAO = moment(parcela.ITLP_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_PROCESSADO = moment(parcela.ITLP_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_INSCRICAO = moment(parcela.ITLP_DT_INSCRICAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_REF_CORRECAO = moment(parcela.ITLP_DT_REF_CORRECAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_REF_MULTA = moment(parcela.ITLP_DT_REF_MULTA, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_REF_JUROS = moment(parcela.ITLP_DT_REF_JUROS, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_LIM_CORRECAO = moment(parcela.ITLP_DT_LIM_CORRECAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_LIM_MULTA = moment(parcela.ITLP_DT_LIM_MULTA, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITLP_DT_LIM_JUROS = moment(parcela.ITLP_DT_LIM_JUROS, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        
        const result = await connection.execute(
          'INSERT INTO tb_it_lancamentos_parcelas VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48, :49, :50, :51, :52, :53, :54, :55, :56, :57, :58, :59, :60, :61, :62, :63, :64, :65, :66, :67, :68)',
          [parcela.ITLP_ID_REGISTRO, parcela.ITLP_ID_CREDOR, parcela.ITLP_CD_LANCAMENTO, parcela.ITLP_NR_PARCELA, parcela.ITLP_VL_ORIGINAL, parcela.ITLP_CD_MOEDA, parcela.ITLP_VL_SALDO_PARCELA, ITLP_DT_VENCIMENTO, ITLP_DT_INICIO, parcela.ITLP_CD_INICIO, ITLP_DT_TERMINO, parcela.ITLP_CD_TERMINO, parcela.ITLP_DS_TERMINO, ITLP_DT_CRIADO_BD, parcela.ITLP_CD_SITUACAO, parcela.ITLP_CD_PARCELA, parcela.ITLP_CD_FASE, parcela.ITLP_CD_MOEDA_CORRECAO, parcela.ITLP_VL_MIGRACAO_PRINCIPAL, parcela.ITLP_VL_MIGRACAO_MULTA, parcela.ITLP_VL_MIGRACAO_JUROS, parcela.ITLP_VL_MIGRACAO_CORRECAO, parcela.ITLP_VL_MIGRACAO_TOTAL, ITLP_DT_MIGRACAO, parcela.ITLP_CD_MOEDA_MIGRACAO, parcela.ITLP_NR_CONTROLE, parcela.ITLP_NR_EXERCICIO_LANCAMENTO, parcela.ITLP_CD_TIPO_LANCAMENTO, parcela.ITLP_NR_LANCAMENTO, parcela.ITLP_CD_ORIGEM, parcela.ITLP_NR_INSCRICAO, parcela.ITLP_VL_INSCRITO, ITLP_DT_INSCRICAO, parcela.ITLP_CD_MOEDA_INSCRICAO, parcela.ITLP_DS_LIVRO, parcela.ITLP_NR_FOLHA, parcela.ITLP_CD_NOSSO_NUMERO, parcela.ITLP_CD_BARRAS, parcela.ITLP_CD_LINHA_DIGITAVEL, parcela.ITLP_DS_OBSERVACOES, parcela.ITLP_NR_BANCO, parcela.ITLP_NR_AGENCIA, parcela.ITLP_CD_CONVENIO, parcela.ITLP_NR_VOLUME, parcela.ITLP_NR_ORDEM, ITLP_DT_GERACAO, parcela.ITLP_CD_STATUS_PROCESSADO, ITLP_DT_PROCESSADO, parcela.ITLP_CD_TIPO_RETORNO, parcela.ITLP_DS_MENSAGEM, parcela.ITLP_CD_EVENTO, parcela.ITLP_CD_ENVIO, parcela.ITLP_DS_INFORMACAO_ORIGEM, parcela.ITLP_VL_MULTA_PRE_EXISTENTE, parcela.ITLP_VL_JUROS_PRE_EXISTENTE, parcela.ITLP_ST_UNICA, ITLP_DT_REF_CORRECAO, ITLP_DT_REF_MULTA, ITLP_DT_REF_JUROS, parcela.ITLP_NR_EXERCICIO_CERTIDAO, parcela.ITLP_NR_CERTIDAO, ITLP_DT_LIM_CORRECAO, ITLP_DT_LIM_MULTA, ITLP_DT_LIM_JUROS, parcela.ITLP_ST_VOLTA_FASE, parcela.ITLP_NR_CERTIDAO_EXCLUIR, parcela.ITLP_NR_EXER_CERTIDAO_EXCLUIR, DATA_INSERT_BANCO],
        );
        console.log("---2");
        console.log(result);
        console.log("---2");
        await connection.commit();
      }));
    }

    res.status(200).send('Dados recebidos e processados com sucesso!');
  } catch (err) {
    console.log("---erro");
    console.log(err);
    console.log("---erro");
  }
});

app.listen(3013, () => console.log('Servidor rodando na porta 3013'));
