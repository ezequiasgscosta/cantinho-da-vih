
ontem 21:43
Chat análise para mim e me diga que projetos tenho que fazer para me candidatar a essa vaga

Na verdade, eu faria justamente isso. É uma estratégia melhor para essa vaga.

Hoje sua loja provavelmente é assim:

Next.js
     │
Supabase (Auth + Banco + API)
Isso é ótimo para desenvolver rápido, mas não demonstra as tecnologias que a Serasa está procurando.

Eu transformaria a arquitetura em:

Next.js (Frontend)

        │
        ▼

Spring Boot (API REST)

        │
        ▼

PostgreSQL
E, se quiser deixar ainda mais profissional:

Next.js

      │
      ▼

Spring Boot
(Spring Security + JWT)

      │
      ▼

PostgreSQL

      │
      ▼

Docker
O que você mantém
Todo o frontend em Next.js.

O layout, telas, carrinho e experiência do usuário.

O projeto continua bonito e moderno.

O que muda
Você remove a lógica que hoje está no Supabase:

Login

Cadastro

Produtos

Categorias

Carrinho

Pedidos

Tudo isso passa para uma API em Spring Boot.

Por que isso é melhor?
Você terá um único projeto que mostra:

✅ Next.js

✅ Java

✅ Spring Boot

✅ PostgreSQL

✅ JWT

✅ API REST

✅ Docker

✅ Arquitetura cliente-servidor

Isso impressiona muito mais um recrutador de backend.

E o Supabase?
Eu não tiraria completamente da sua vida. Ele é uma ferramenta excelente. Mas, para esse projeto específico, eu o substituiria por PostgreSQL + Spring Boot, porque é muito mais alinhado ao perfil da vaga.

Minha sugestão
Pegue sua loja virtual e transforme-a em um projeto de nível corporativo:

Frontend: Next.js + TypeScript

Backend: Java 21 + Spring Boot

Banco: PostgreSQL

Segurança: Spring Security + JWT

Documentação: Swagger/OpenAPI

Containers: Docker e Docker Compose

Testes: JUnit + Mockito

Deploy: Frontend na Vercel e backend em uma plataforma como Railway, Render ou AWS.

Esse único projeto já serviria como uma excelente peça de portfólio para vagas de desenvolvedor Java.

Eu só faria um ajuste: em vez de ser apenas uma loja simples, adicionaria funcionalidades que demonstram conhecimento de backend, como controle de estoque, níveis de acesso (cliente e administrador), histórico de pedidos, filtros de produtos, paginação, validações, tratamento de exceções e logs. Isso faz o projeto parecer muito mais próximo de um sistema usado por empresas.


7002.jpg
7001.jpg
E pra essa vaga

Essa vaga é um pouco diferente da anterior. Ela é para Jr Software Engineer, mas o foco é outro.

Pelos requisitos da imagem, eles procuram alguém com:

Scala (principal tecnologia)

Programação funcional

AWS ou GCP

PostgreSQL

SQL

Git

Testes

Sistemas distribuídos

Mensageria (Google Pub/Sub)

Código limpo

Debug

O problema
O maior obstáculo não é experiência, é este requisito:

Scala development experience

Se você nunca trabalhou com Scala, suas chances diminuem, porque é uma linguagem bastante específica.

A boa notícia
Você não precisa fazer tudo em Scala para fortalecer seu currículo.

Se eu estivesse montando um portfólio pensando na Serasa, faria uma loja virtual mais robusta com tecnologias que também aparecem nessa vaga:

Frontend
Next.js

TypeScript

Backend
Spring Boot

PostgreSQL

JWT

Docker

Depois adicionaria:

Testes automatizados (JUnit)

GitHub Actions (CI)

Deploy

Logs

Documentação Swagger

Depois, faria um projeto menor em Scala
Não precisa ser uma loja inteira.

Pode ser uma API simples, por exemplo:

Cadastro de clientes

CRUD

PostgreSQL

Docker

O objetivo é mostrar que você sabe o básico da linguagem.

Se você quiser realmente disputar essa vaga
Eu seguiria esta ordem:

Java + Spring Boot (mais vagas no mercado e também atende a outra vaga da Serasa).

AWS (EC2, S3, IAM).

Docker.

PostgreSQL.

Testes.

Scala.

Minha avaliação
Hoje, eu diria que essa vaga é mais difícil para o seu perfil atual do que a anterior, porque ela pede conhecimentos específicos de Scala e programação funcional.

A vaga de Analista de Desenvolvimento de Software (Java/Spring Boot) está mais alinhada com a transição que você quer fazer e aproveita melhor seus conhecimentos atuais de desenvolvimento web.

O que eu faria no seu lugar
Em vez de criar vários projetos pequenos, faria um projeto muito completo:

🛒 Loja virtual (Next.js)

🔐 Login com JWT

📦 Gestão de estoque

💳 Pedidos

👤 Painel administrativo

📊 Dashboard

🌐 API Spring Boot

🐘 PostgreSQL

🐳 Docker

☁️ Deploy

🧪 Testes

📄 Swagger

Esse tipo de projeto demonstra diversas competências que aparecem em vagas de engenharia de software, mesmo quando a linguagem principal muda. Depois, você pode complementar o portfólio com um projeto menor em Scala para mostrar familiaridade com a tecnologia exigida.


hoje 0:58
Como ficaria um realme profissional para um projeto desse

Se o objetivo é impressionar empresas como Serasa Experian, Mercado Livre, Nubank, PicPay e outras grandes empresas de tecnologia, eu faria um projeto que parecesse um sistema usado por uma empresa de verdade, não apenas uma loja para vender produtos.

Projeto: E-Commerce Enterprise
Tecnologias
Frontend
Next.js 15

React

TypeScript

Tailwind CSS

Shadcn UI

React Query

Zod

React Hook Form

Backend
Java 21

Spring Boot 3

Spring Security

JWT

Spring Data JPA

Lombok

MapStruct

Swagger/OpenAPI

Banco
PostgreSQL

Infraestrutura
Docker

Docker Compose

Qualidade
JUnit 5

Mockito

GitHub Actions

SonarLint

Funcionalidades
Área pública
Página inicial

Produtos

Pesquisa

Categorias

Filtros

Produto

Carrinho

Favoritos

Cliente
Cadastro

Login

Recuperar senha

Minha Conta
Perfil

Endereços

Histórico de pedidos

Alterar senha

Checkout
Carrinho

Cupom

Frete

Pagamento fictício

Confirmação

Painel Administrativo
Login separado.

Dashboard com gráficos.

Produtos
Cadastrar

Editar

Excluir

Upload de imagens

Categorias
CRUD completo.

Usuários
Clientes

Administradores

Pedidos
Aguardando

Pago

Enviado

Entregue

Cancelado

Estoque
Entrada de produtos

Saída automática

Histórico

Alerta de estoque baixo

Dashboard
Gráficos de:

vendas

pedidos

estoque

produtos mais vendidos

faturamento mensal

Arquitetura
Frontend (Next.js)

        │

 REST API

        │

Spring Boot

        │

Service

        │

Repository

        │

PostgreSQL
Segurança
JWT

Refresh Token

Spring Security

Roles

ADMIN

CLIENT
Estrutura do Backend
src

controller

service

repository

entity

dto

mapper

config

security

exception

utils

validation
Banco
Tabelas

users

roles

products

categories

orders

order_items

cart

addresses

coupons

stock

logs
API
POST /auth/login

POST /auth/register

GET /products

POST /products

PUT /products

DELETE /products

GET /orders

POST /orders

GET /dashboard