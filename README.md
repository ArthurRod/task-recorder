# task-recorder

Todo list para armazenar tasks através da gravação de áudios utilizando a API `Speech-to-Text` da Google Cloud.

---

### ⚙️ Pré-requisitos

- Node (v18+)
- Go instalado (v1.18+)
- Conta no Google Cloud
- `gcloud CLI` instalado: https://cloud.google.com/sdk/docs/install

---

### Passo a passo para configurar o projeto na Google Cloud

#### 1. Login via CLI do Google Cloud

```bash
gcloud auth login
```

#### 2. Crie um novo projeto

```bash
gcloud projects create ID_UNICO_DO_SEU_PROJETO --name="Speech Project"
```

#### 3. Defina as credenciais para o seu projeto

```bash
gcloud auth application-default set-quota-project ID_UNICO_DO_SEU_PROJETO
```

Esse comando configura o projeto de cota para a autenticação padrão da aplicação (Application Default Credentials - ADC). Ele garante que as chamadas de API feitas com as credenciais de autenticação padrão sejam associadas ao projeto especificado, permitindo que o Google Cloud monitore o uso de cota e controle os limites de API corretamente.

Após executar esse comando você deverá ver algo como:

```bash
Credentials saved to file: [/home/usuario/.config/gcloud/application_default_credentials.json]

These credentials will be used by any library that requests Application Default Credentials (ADC).

Quota project "ID_UNICO_DO_SEU_PROJETO" was added to ADC which can be used by Google client libraries for billing and quota. Note that some services may still bill the project owning the resource.
```

#### 4. Defina uma conta de faturamento para o seu projeto através do console no link abaixo

https://console.cloud.google.com/

Obs: Existe um limite de uso gratuito da api, se exceder o limite podem haver cobranças de acordo com a tabela abaixo

https://cloud.google.com/speech-to-text/pricing

##### 4.1. Selecione o seu projeto no canto superior esquerdo

![Imagem doc 1](https://raw.githubusercontent.com/ArthurRod/task-recorder/main/mobile/assets/docs/doc1.png)

##### 4.1. Abra o menu lateral e selecione a opção "Faturamento"

![Imagem doc 2](https://raw.githubusercontent.com/ArthurRod/task-recorder/main/mobile/assets/docs/doc2.png)

##### 4.1. Defina a conta de faturamento

![Imagem doc 3](https://raw.githubusercontent.com/ArthurRod/task-recorder/main/mobile/assets/docs/doc2.png)

Caso ainda não possua uma, pode seguir esse passo a passo abaixo para criar uma nova

https://cloud.google.com/billing/docs/how-to/create-billing-account

#### 5. Ative a API `Speech-to-Text` no seu projeto

```bash
gcloud services enable speech.googleapis.com
```

#### 6. Verifique se a API foi ativada no seu projeto

```bash
gcloud services list --enabled
```

Após executar esse comando você deverá ver algo como:

```bash
...
speech.googleapis.com               Cloud Speech-to-Text API
...
```

Feito isso será possível executar o `task-recorder`

---

### Passo a passo para executar o projeto

#### 1. Clone o projeto

```bash
git clone https://github.com/ArthurRod/task-recorder.git
```

#### 2. Acesse a pasta `server`

```bash
cd server
```

#### 3. Instale as dependências

```bash
go mod tidy
```

#### 4. Execute o `server`

```bash
go run main.go
```

#### 5. Acesse a pasta `mobile`

```bash
cd ..
```

```bash
cd mobile
```

#### 5. Instale as dependências

```bash
npm install
```

#### 5. Execute o app

```bash
npm start
```
