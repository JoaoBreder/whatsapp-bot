const Order = require('./order.js');
require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN, {
    lazyLoading: true
});

let order;

// Main function
exports.processMessage = async (msg, senderId, profileName) => {
    try {
        if (!order) {
            const message = `Olá ${profileName}! Seja bem-vindo ao Bot de Restaurante.
            
O que você gostaria de pedir:

- Refeições
1.  Contra filé com fritas - R$20.00
2.  Contra filé a parmegiana - R$20.00
3.  Bife amilanesa - R$18.00

- Lanches
4.  Hambúrguer - R$22.00
5.  Porção Grande de Batata Frita - R$12.00

- Sobremesa
6.  Sundae de Chocolate - R$ 5.60

- Bebidas
7.  Refrigerante Lata (400 ml) - R$ 9.90
8.  Suco Lata (400 ml) - R$ 9.90

Para selecionar um item, digite 'adicionar' e o seu número. Se quiser ver o que já selecionou, digite 'carrinho'.

Caso tenha adicionado algum por engano, é só digitar 'remover' e o número do item no carrinho.

Antes de finalizar o seu pedido, verifique se está tudo correto e então digite 'concluir pedido'.`;

            sendMessage(senderId, message);
            order = new Order();
            return;
        }

        const request = msg.toLowerCase();

        if (request.match(/adicionar/)) {
            const item = request.split('adicionar ')[1];
            order.add(Number(item - 1));

            sendMessage(
                senderId,
                `Item ${item} adicionado ao carrinho.\n\nSe colocou o item errado por engano, digite 'carrinho' para ver o número do item e depois 'remover' para retirar o item especificado depois do comando.`
            );
        } else if (request.match(/carrinho/)) {
            const message = order.listItens();

            sendMessage(
                senderId,
                message
            );
        } else if (request.match(/remover/)) {
            const item = request.split('remover ')[1];
            order.remove(Number(item) - 1);

            sendMessage(
                senderId,
                `Item ${item} removido do carrinho.`
            );
        } else if (request.match(/concluir pedido/)) {
            order = undefined;
            sendMessage(
                senderId,
                'Seu pedido foi concluído e encaminhado para o restaurante. Obrigado e tenha uma ótima refeição.'
            );
        } else {
            sendMessage(
                senderId,
                'Comando não reconhecido, por favor verifique se digitou corretamente e tente mais uma vez.'
            );
        }
    } catch (error) {
        console.log(`Error => ${error}`);

        sendMessage(
            senderId,
            'Erro, tente novamente.'
        );
    }
};

async function sendMessage(senderId, message) {
    await client.messages.create({
        to: senderId,
        body: message,
        from: `whatsapp:${process.env.WHATSAPP_BOT_NUMBER}`
    });
}