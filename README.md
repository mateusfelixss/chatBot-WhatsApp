# chatBot-WhatsApp

Essa aplicação consiste no desenvolvimento de um bot de WhatsApp que faz um _To Do List_ em JavaScript utilizando a API [WppConnect](https://wppconnect.io/wppconnect/index.html) 

## Funcionalidades
- [X] Salvar novo contato no BD
- [X] Envio de mensagem
- [X] Buscar usuário já cadastrado
- [X] Criar lista de tarefas (create)
- [X] Mostrar a lista de tarefas do usuario (read)
- [ ] Atualizar lista (update)
- [ ] Excluir lista (delete)

As funcionalidades marcadas são as que já foram implementadas e as demais serão desenvolvidas ainda.

## Execução
Para executar é necessario realizar algumas configurações.
1. Certifique se que o NodeJS está instalado.
2. Para instalar o WPPConnect é necessario  executar o seguinte comando:
```
npm i --save @wppconnect-team/wppconnect   
```
3. Para configurar o banco de dados, é necessario acessar o site do Firebase para criar e configurar _Firebase Credentials_
```
npm install firebase-admin --save
```
Após a configuração no site do Firebase, um arquivo .json será gerado e o mesmo deve ser adicionado no aquivo _firebase.js_.

4. Tendo configurado todo o ambiente e executado o sistema, para conectar com o seu WhatsApp é necessario ler o QR Code gerado, para iniciar uma conversa é nessario enviar a palavra `start` no WhatsApp

## Tecnologias utilizadas
+ [WppConnect](https://wppconnect.io/wppconnect/index.html)
  + É a API responsavel por fazer a conexão com o WhatsApp   
+ [NodeJS](https://nodejs.org/en)
+ [Firebase](https://firebase.google.com/?hl=pt)
  + É utilizado o Firestore como banco de dados NoSQL para armazenamento das mensagens trocadas e informações dos usuários.
+ [Visual Studio Code](https://code.visualstudio.com/)

## Trabalhos futuros e contribuições
Esse projeto ainda está em desenvolvimento e suas proximas etapas cosiste no desenvolvimento das funcionalidades de *update* e *delete*. Durante os processos de desenvolvimento, ajustes para uma melhor compreensão do sistema serão feitos, assim como novas informações serão adicionadas a esse documento.

Quem se interessar pode estar contribuindo para o desenvolvimento.
