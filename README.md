
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