const Order = require('./order.js');
require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN, {
    lazyLoading: true
});

const orderNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];

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

Para selecionar um item basta digitar o seu número. Se quiser ver o que já selecionou, digite 'carrinho'.

Caso tenha adicionado algum por engano, é só digitar 'remover' e o número do item no carrinho.

Antes de finalizar o seu pedido, verifique se está tudo correto e então digite 'concluir pedido'.

Caso queira rever os comandos, digite 'ajuda'.`;

            sendMessage(senderId, message);
            order = new Order();
            return;
        }

        const request = msg.toLowerCase();

        switch (request) {
            case 'ajuda':
                sendMessage(
                    senderId,
                    `Comandos:
- ajuda: Envia uma mensagem com os comandos do bot
- menu: Menu do restaurante
- carrinho: Mostra o seu carrinho de compras
- remover {número do item no carrinho}: Remove o item especificado do carrinho
- concluir pedido: Conclui o seu pedido e encaminha para o restaurante`
                );

                break;


            case 'menu':
                sendMessage(
                    senderId,
                    `- Refeições
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
8.  Suco Lata (400 ml) - R$ 9.90`
                );

                break;

            case 'carrinho':
                const message = order.listItens();

                sendMessage(
                    senderId,
                    message
                );

                break;

            case 'concluir pedido':
                order = undefined;
                sendMessage(
                    senderId,
                    'Seu pedido foi concluído e encaminhado para o restaurante. Obrigado e tenha uma ótima refeição.'
                );

                break;


            default:
                if (orderNumbers.find((item) => item === '3')) {
                    order.add(Number(request) - 1);
                    sendMessage(
                        senderId,
                        `Item ${request} adicionado ao carrinho.\n\nSe colocou o item errado por engano, digite 'carrinho' para ver o número do item e depois 'remover {número do item}' para retirar o item especificado depois do comando.`
                    );

                    return;
                }

                if (request.match(/remover/)) {
                    const item = request.split('remover ')[1];
                    order.remove(Number(item) - 1);

                    sendMessage(
                        senderId,
                        `Item ${item} removido do carrinho.`
                    );
                }

                sendMessage(
                    senderId,
                    'Comando não reconhecido, por favor verifique se digitou corretamente e tente mais uma vez.'
                );

                break;
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