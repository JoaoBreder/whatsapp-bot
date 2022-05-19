const menu = [
    { item: 'Contra filé com fritas', value: 20.00 },
    { item: 'Contra filé a parmegiana', value: 20.00 },
    { item: 'Bife amilanesa', value: 18.00 },
    { item: 'Hambúrguer', value: 22.00 },
    { item: 'Porção Grande de Batata Frita', value: 12.00 },
    { item: 'Sundae de Chocolate', value: 5.60 },
    { item: 'Refrigerante Lata (400 ml)', value: 9.90 },
    { item: 'Suco Lata (400 ml)', value: 9.90 },
];

module.exports = class Order {
    constructor() {
        this.total = 0;
        this.orderList = [];
    }

    add(itemMenu) {
        const {
            item,
            value
        } = menu[itemMenu];

        this.total += value;

        this.orderList.push({
            item,
            value
        });
    }

    remove(itemOrder) {
        const { value } = this.orderList[itemOrder];
        this.orderList.splice(itemOrder, 1);
        this.total -= value;
    }

    listItens() {
        const message = ['Seu pedido possui os seguintes itens:'];

        if (this.orderList.length !== 0) {
            for (let i = 0; i < this.orderList.length; i++) {
                const { item, value } = this.orderList[i];
                message.push(`${i + 1}. ${item} - R$ ${value}`);
            }
        } else {
            return 'Seu carrinho está vazio.'
        }

        message.push(`\nTotal: R$ ${this.total}`);
        return message.join('\n');
    }
}