# App

GymPass style app.

## RF (Requisitos funcionais)
 
- [] Deve ser possível se cadastrar
- [] Deve ser possível se autenticar
- [] Deve ser possível obter o perfil de um usuário logado
- [] Deve ser possível obter o número do check-ins realizados pelo usuário logado
- [] Deve ser possível o usuário obter seu histórico de check-ins
- [] Deve ser possível o usuário buscar academias próximas
- [] Deve ser possível o usuário buscar uma academia pelo nome
- [] Deve ser possível o usuário realizar check-in em uma academia
- [] Deve ser possível validar o check-in de um usuário
- [] Deve ser possível cadastrar uma academia
 
## RNs (Regras de negócio)

- [] O usuário não deve poder se cadastrar com um email duplicado
- [] o usuário não pode fazer 2 check-in no mesmo dia
- [] O usuário não pode fazer check-in se não estiver perto (100m) da academia
- [] O check-in só pode ser validado até 20min após ser criado
- [] O check-in só pode ser validado por administradores
- [] A academia só pode ser cadastrada por administradores

## RNFs (Requisitos não-funcinais)

- [] A senha do usuário precisa está criptografada
- [] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- [] todas as listas de dados precisam estar paginadas em 20 itens por página
- [] O usuário deve ser identificado por um JWT

