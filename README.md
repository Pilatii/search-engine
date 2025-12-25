# Search Engine

Este projeto implementa um mecanismo de busca textual utilizando Node.js e PostgreSQL, com foco em indexação e performance. A ideia principal é criar um Search Engine sem utilizar ORMs ou frameworks.

Grande parte dos projetos backend modernos delega completamente o acesso a dados para ORMs. Isso facilita o desenvolvimento, mas esconde decisões importantes: índices, joins, custos de queries e comportamento real do banco. Neste projeto, todas essas decisões são explícitas.

## Modelagem e indexação

Os documentos são armazenados separadamente dos termos.
Cada termo existe apenas uma vez no banco, enquanto a relação entre documento e termo armazena a frequência daquele termo no documento, permitindo:

- evitar duplicação de dados
- buscas rápidas por termo
- ranking simples e eficiente

Índices foram criados manualmente e validados via EXPLAIN ANALYZE, garantindo que as buscas utilizem Index Scan e Bitmap Index Scan, e não Seq Scan.

## Processo de indexação

1. O conteúdo é normalizado
2. A frequência de termos é calculada em memória, considerando:
	- número máximo de termos por documento
	- frequência máxima por termo

3. Termos são inseridos em batch
4. Relações documento -> termo também são inseridas em batch usando UNNEST
5. Todo o processo roda dentro de uma transação, evitando:
	- múltiplos round-trips desnecessários ao banco
	- inserts linha a linha
	- inconsistências parciais em caso de erro

## Busca

A busca é feita inteiramente em SQL, usando JOINs entre terms, documents_terms e documents. O projeto suporta busca multi-termo, combinando termos e ranqueando documentos com base na frequência acumulada.

## Considerações finais

Este projeto não pretende ser uma solução completa de busca, mas criei como um exercício técnico sobre como dados são indexados, relacionados e recuperados de forma eficiente usando SQL e Node.js.
