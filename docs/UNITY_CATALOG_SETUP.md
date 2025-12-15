# Configuração do Unity Catalog (Zero-Maintenance)

## Visão Geral
Este catálogo foi desenhado para ser um espelho fiel do Databricks Unity Catalog. A aplicação é agnóstica a mudanças de esquema: novos campos adicionados ao JSON aparecerão automaticamente na UI.

## Filosofia "Zero-Maintenance"
- **Metadados como Código**: A UI não precisa de alteração para exibir novos campos.
- **Resiliência**: Campos ausentes não quebram a aplicação.
- **Mirroring**: O que está no JSON é o que o usuário vê.

## Como Atualizar os Dados

### 1. Fonte da Verdade
A fonte primária é o `system.information_schema` do Databricks.
Execute uma query similar a esta para extrair os metadados basais:

```sql
SELECT
  table_name as title,
  comment as description,
  table_owner as owner,
  'Databricks' as platform,
  concat(table_catalog, '.', table_schema, '.', table_name) as catalog_path,
  storage_location as location,
  -- Adicione campos customizados aqui
  properties:business_unit as business_unit,
  properties:compliance_tag as compliance_tag
FROM system.information_schema.tables
WHERE table_catalog = 'prod_catalog'
```

### 2. Formato do JSON (`src/data/catalog.json`)
Campos com tratamento especial na UI:
- `id` (obrigatório, único)
- `title` (destaque)
- `description` (texto principal)
- `layer` (Bronze/Silver/Gold - define cores)
- `tags` (array de strings)
- `schema` (array de objetos {name, type, description})

**Campos Dinâmicos**:
Qualquer outro campo adicionado ao objeto JSON (ex: `data_steward`, `last_updated`, `cost_center`) será automaticamente renderizado na seção "Metadados Adicionais" da página de detalhes. Objetos aninhados são exibidos como JSON formatado.

## Autenticação
A aplicação não gerencia credenciais de dados.
- **Acesso ao Catálogo**: Público (dentro da rede corporativa/GitHub Pages).
- **Acesso aos Dados**: Os links de "Caminho no Catálogo" e queries SQL dependem do acesso do usuário ao Databricks Workspace. O SSO do Databricks é a barreira de segurança.
