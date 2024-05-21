const oracledb = require('oracledb');
const express = require('express');
const moment = require('moment'); 
const app = express();

// Inicializando o cliente Oracle
oracledb.initOracleClient({libDir: 'C:\\Users\\eduar\\Downloads\\Oracle Instant Client\\instantclient_12_2'});

// Middleware para analisar corpos de solicitação JSON
app.use(express.json());

app.post('/api/receberDadosAcordoParcelaPagamento', async (req, res) => {
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

    // Verificando se os eventos são "acordo_parcela_pagamento_int" antes de inserir os dados
    if (dados.acordos.ITAC_CD_EVENTO !== 'acordo_parcela_pagamento_int') {
      throw new Error('O evento de acordos não é "acordo_parcela_pagamento_int"');
    }

    // Processando os dados de 'acordos'
    const acordos = dados.acordos;

    let ITAC_DT_ACORDO = moment(acordos.ITAC_DT_ACORDO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITAC_DT_MIGRACAO = moment(acordos.ITAC_DT_MIGRACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITAC_DT_CRIADO_BD = moment(acordos.ITAC_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITAC_DT_INICIO = moment(acordos.ITAC_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITAC_DT_TERMINO = moment(acordos.ITAC_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITAC_DT_GERACAO = moment(acordos.ITAC_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
    let ITAC_DT_PROCESSADO = moment(acordos.ITAC_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();

    let result = await connection.execute(
      'INSERT INTO tb_it_acordos VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48)',
      [acordos.ITAC_ID_REGISTRO, acordos.ITAC_ID_CREDOR, acordos.ITAC_CD_ACORDO, acordos.ITAC_NR_EXERCICIO_ACORDO, acordos.ITAC_CD_TRIBUTO_ACORDO, acordos.ITAC_NR_ACORDO, acordos.ITAC_CD_ORIGEM_ACORDO, acordos.ITAC_CD_CADASTRO, acordos.ITAC_CD_ORIGEM_CADASTRO, acordos.ITAC_DS_CADASTRO, acordos.ITAC_VL_ACORDO, acordos.ITAC_VL_SALDO_ACORDO, ITAC_DT_ACORDO, acordos.ITAC_CD_MOEDA, acordos.ITAC_QT_PARCELAS, acordos.ITAC_VL_HONORARIOS, acordos.ITAC_VL_CUSTAS, acordos.ITAC_CD_SITUACAO, acordos.ITAC_VL_MIGRACAO_PRINCIPAL, acordos.ITAC_VL_MIGRACAO_MULTA, acordos.ITAC_VL_MIGRACAO_JUROS, acordos.ITAC_VL_MIGRACAO_CORRECAO, acordos.ITAC_VL_MIGRACAO_TOTAL, acordos.ITAC_CD_MIGRACAO_MOEDA, ITAC_DT_MIGRACAO, acordos.ITAC_CD_PESSOA_SOLICITANTE, acordos.ITAC_CD_VINCULO_SOLICITANTE, acordos.ITAC_DS_OBSERVACAO, acordos.ITAC_NR_CONTROLE, acordos.ITAC_ID_ACORDO, ITAC_DT_CRIADO_BD, ITAC_DT_INICIO, acordos.ITAC_CD_INICIO, ITAC_DT_TERMINO, acordos.ITAC_CD_TERMINO, acordos.ITAC_DS_TERMINO, acordos.ITAC_NR_CPF_CNPJ_SOLICITANTE, acordos.ITAC_DS_PESSOA_SOLICITANTE, acordos.ITAC_NR_TERMO, ITAC_DT_GERACAO, acordos.ITAC_CD_STATUS_PROCESSADO, ITAC_DT_PROCESSADO, acordos.ITAC_CD_TIPO_RETORNO, acordos.ITAC_DS_MENSAGEM, acordos.ITAC_CD_EVENTO, acordos.ITAC_CD_ENVIO, acordos.ITAC_DS_INFORMACAO_ORIGEM, DATA_INSERT_BANCO],
    );
    console.log("---1");
    console.log(result);
    console.log("---1");
    await connection.commit();

    // Verificando se os eventos são "acordo_parcela_pagamento_int" antes de inserir os dados de 'acordosParcelas'
    if (Array.isArray(dados.acordos.acordosParcelas)) {
      if (!dados.acordos.acordosParcelas.every(parcela => parcela.ITAP_CD_EVENTO === 'acordo_parcela_pagamento_int')) {
        throw new Error('O evento de acordosParcelas não é "acordo_parcela_pagamento_int"');
      }
    }

    // Processando os dados de 'acordosParcelas'
    const acordosParcelas = dados.acordos.acordosParcelas;

    // Se 'acordosParcelas' for um array, iterar sobre ele
    if (Array.isArray(dados.acordos.acordosParcelas)) {
      await Promise.all(dados.acordos.acordosParcelas.map(async (parcela, index) => {
        // Processando os dados das parcelas
        const ITAP_DT_MIGRACAO = moment(parcela.ITAP_DT_MIGRACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITAP_DT_VENCIMENTO = moment(parcela.ITAP_DT_VENCIMENTO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITAP_DT_CRIADO_BD = moment(parcela.ITAP_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITAP_DT_INICIO = moment(parcela.ITAP_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITAP_DT_TERMINO = moment(parcela.ITAP_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITAP_DT_GERACAO = moment(parcela.ITAP_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        const ITAP_DT_PROCESSADO = moment(parcela.ITAP_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();

        const result = await connection.execute(
          'INSERT INTO tb_it_acordos_parcelas VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48)',
          [parcela.ITAP_ID_REGISTRO, parcela.ITAP_ID_CREDOR, parcela.ITAP_CD_ACORDO, parcela.ITAP_NR_EXERCICIO_ACORDO, parcela.ITAP_CD_TRIBUTO_ACORDO, parcela.ITAP_NR_ACORDO, parcela.ITAP_CD_ORIGEM_ACORDO, parcela.ITAP_NR_PARCELA, parcela.ITAP_VL_PARCELA, parcela.ITAP_VL_SALDO_PARCELA, ITAP_DT_VENCIMENTO, parcela.ITAP_CD_MOEDA, parcela.ITAP_VL_HONORARIOS, parcela.ITAP_VL_CUSTAS, parcela.ITAP_CD_SITUACAO, parcela.ITAP_VL_MIGRACAO_PRINCIPAL, parcela.ITAP_VL_MIGRACAO_MULTA, parcela.ITAP_VL_MIGRACAO_JUROS, parcela.ITAP_VL_MIGRACAO_CORRECAO, parcela.ITAP_VL_MIGRACAO_TOTAL, parcela.ITAP_CD_MIGRACAO_MOEDA, ITAP_DT_MIGRACAO, parcela.ITAP_CD_PARCELA, parcela.ITAP_CD_NOSSO_NUMERO, parcela.ITAP_CD_BARRAS, parcela.ITAP_CD_LINHA_DIGITAVEL, parcela.ITAP_DS_OBSERVACAO, parcela.ITAP_NR_BANCO, parcela.ITAP_NR_AGENCIA, parcela.ITAP_CD_CONVENIO, parcela.ITAP_NR_CONTROLE, parcela.ITAP_ID_ACORDO, parcela.ITAP_CD_CORRECAO, ITAP_DT_CRIADO_BD, ITAP_DT_INICIO, parcela.ITAP_CD_INICIO, ITAP_DT_TERMINO, parcela.ITAP_CD_TERMINO, parcela.ITAP_DS_TERMINO, ITAP_DT_GERACAO, parcela.ITAP_CD_STATUS_PROCESSADO, ITAP_DT_PROCESSADO, parcela.ITAP_CD_TIPO_RETORNO, parcela.ITAP_DS_MENSAGEM, parcela.ITAP_CD_EVENTO, parcela.ITAP_CD_ENVIO, parcela.ITAP_DS_INFORMACAO_ORIGEM, DATA_INSERT_BANCO],
        );
        console.log("---2");
        console.log(result);
        console.log("---2");
        await connection.commit();
      }));
    }

    // Verificando se os eventos são "acordo_parcela_pagamento_int" antes de inserir os dados de 'pagamentos'
    if (Array.isArray(dados.acordos.pagamentos)) {
      if (!dados.acordos.pagamentos.every(pagamento => pagamento.ITPA_CD_EVENTO === 'acordo_parcela_pagamento_int')) {
        throw new Error('Um ou mais eventos de pagamentos não são "acordo_parcela_pagamento_int"');
      }
    }

    // Processando os dados de 'pagamentos'
    const pagamentos = dados.acordos.pagamentos;

    // Se 'pagamentos' for um array, iterar sobre ele
    if (Array.isArray(dados.acordos.pagamentos)) {
      await Promise.all(dados.acordos.pagamentos.map(async (pagamento, index) => {
        // Processando os dados dos pagamentos
        let ITPA_DT_CREDITO = moment(pagamento.ITPA_DT_CREDITO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        let ITPA_DT_PAGO = moment(pagamento.ITPA_DT_PAGO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        let ITPA_DT_MOVIMENTO = moment(pagamento.ITPA_DT_MOVIMENTO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        let ITPA_DT_CRIADO_BD = moment(pagamento.ITPA_DT_CRIADO_BD, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        let ITPA_DT_INICIO = moment(pagamento.ITPA_DT_INICIO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        let ITPA_DT_TERMINO = moment(pagamento.ITPA_DT_TERMINO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        let ITPA_DT_GERACAO = moment(pagamento.ITPA_DT_GERACAO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();
        let ITPA_DT_PROCESSADO = moment(pagamento.ITPA_DT_PROCESSADO, 'DD/MM/YYYY').format('DD-MMM-YYYY').toUpperCase();

        const result = await connection.execute(
          'INSERT INTO tb_it_pagamentos VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48, :49, :50, :51, :52, :53, :54, :55, :56, :57, :58, :59, :60)',
          [
            pagamento.ITPA_ID_REGISTRO, pagamento.ITPA_ID_CREDOR, pagamento.ITPA_NR_BANCO, pagamento.ITPA_NR_AGENCIA, 
            pagamento.ITPA_CD_CONVENIO, pagamento.ITPA_NR_MOVIMENTO, pagamento.ITPA_CD_NOSSO_NUMERO, pagamento.ITPA_CD_PARCELA, 
            pagamento.ITPA_NR_EXERCICIO, pagamento.ITPA_CD_TRIBUTO, pagamento.ITPA_NR_LANCAMENTO, pagamento.ITPA_CD_TIPO_PARCELA, 
            pagamento.ITPA_CD_ORIGEM, pagamento.ITPA_NR_PARCELA, pagamento.ITPA_CD_MOEDA, pagamento.ITPA_VL_PAGO, 
            pagamento.ITPA_VL_ENCARGOS, ITPA_DT_CREDITO, ITPA_DT_PAGO, pagamento.ITPA_CD_BARRAS, 
            pagamento.ITPA_DS_OBSERVACOES, pagamento.ITPA_NR_CONTROLE, pagamento.ITPA_VL_PAGO_PRINCIPAL, pagamento.ITPA_VL_PAGO_JUROS, 
            pagamento.ITPA_VL_PAGO_MAIOR, pagamento.ITPA_VL_PAGO_MENOR, pagamento.ITPA_VL_PAGO_MULTA, pagamento.ITPA_VL_PAGO_CORRECAO, 
            pagamento.ITPA_VL_DESCONTO, pagamento.ITPA_CD_LANCAMENTO, ITPA_DT_MOVIMENTO, pagamento.ITPA_NR_CONTA, 
            pagamento.ITPA_CD_LOTE, pagamento.ITPA_NR_LOTE_RETORNO, pagamento.ITPA_NR_SEGMENTO_RETORNO, ITPA_DT_CRIADO_BD, 
            ITPA_DT_INICIO, pagamento.ITPA_CD_INICIO, ITPA_DT_TERMINO, pagamento.ITPA_CD_TERMINO, 
            pagamento.ITPA_DS_TERMINO, pagamento.ITPA_VL_PAGO_HONORARIO, pagamento.ITPA_VL_PAGO_CUSTA, pagamento.ITPA_VL_CALCULADO, 
            pagamento.ITPA_VL_CALCULADO_PRINCIPAL, pagamento.ITPA_VL_CALCULADO_MULTA, pagamento.ITPA_VL_CALCULADO_JUROS, pagamento.ITPA_VL_CALCULADO_CORRECAO, 
            pagamento.ITPA_VL_CALCULADO_HONORARIO, pagamento.ITPA_VL_CALCULADO_CUSTA, pagamento.ITPA_VL_PAGO_TOTAL_GUIA, ITPA_DT_GERACAO, 
            pagamento.ITPA_CD_STATUS_PROCESSADO, ITPA_DT_PROCESSADO, pagamento.ITPA_CD_TIPO_RETORNO, pagamento.ITPA_DS_MENSAGEM, 
            pagamento.ITPA_CD_EVENTO, pagamento.ITPA_CD_ENVIO, pagamento.ITPA_DS_INFORMACAO_ORIGEM, DATA_INSERT_BANCO
          ],
        );
        console.log("---3");
        console.log(result);
        console.log("---3");
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

app.listen(3014, () => console.log('Servidor rodando na porta 3014'));
