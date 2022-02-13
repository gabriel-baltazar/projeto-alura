
const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
  adiciona(atendimento,res) {
    const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')

    const dataEhvalida = moment(data).isSameOrAfter(dataCriacao)
    const clienteEhValido = atendimento.cliente.length >= 3

    const validacoes = [
      {
        nome: 'data',
        valido: dataEhvalida,
        mensagem: 'Data deve ser maior ou igual a data atual',
      },
      {
        nome:'cliente',
        valido: clienteEhValido,
        mensagem: 'Cliente deve ter no mínimo 3 caracteres',
      }
    ]
    const erros = validacoes.filter(campo => !campo.valido)
    const existemErros = erros.length

    if(existemErros){
      res.status(400).json(erros)
    }else{
      const atendimentoDatado = {...atendimento, dataCriacao, data}

      const sql = 'INSERT INTO Atendimentos SET ?'

      conexao.query(sql, atendimentoDatado, (erro) => {
        if (erro) {
          res.status(400).json(erro)
        }else{
          res.status(201).json(atendimento)
        }
      })
    }
    
  }

  lista(res) {
    const sql = 'SELECT * FROM atendimentos'

    conexao.query(sql,(erro, resultados) => {
      if(erro){
        res.status(400).json(erro)
      }else{
        res.status(200).json(resultados)
      }
    })
  }

  buscaPorId(id,res) {
    const sql = `SELECT * FROM atendimentos WHERE id = ${id}`

    conexao.query(sql,(erro, resultados) => {
      const atendimento = resultados[0]
      if(erro){
        res.status(400).json(erro)
      }else{
        res.status(200).json(atendimento)
      }
    })
  }

  altera(id, valores, res){
    if(valores.data){
      valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
    }
    const sql = `UPDATE atendimentos SET ? WHERE id = ?`

    conexao.query(sql,[valores,id], (erro) => {
      if(erro){
        res.status(400).json(erro)
      }else{
        res.status(200).json({...valores,id})
      }
    })
  }
  
  deleta(id, res){
    const sql = 'DELETE from atendimentos WHERE id = ?'
    conexao.query(sql,id,(erro) => {
      if(erro){
        res.status(400).json(erro)
      }else{
        res.status(200).json({id})
      }
    })
  }
}

module.exports = new Atendimento