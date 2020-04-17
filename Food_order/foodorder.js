class order {
    constructor(N_food, S_food, F_food, total_items, item, quantity) {
        this.N_food = N_food;
        this.S_food = S_food;
        this.F_food = F_food;
        this.total_items = total_items;
        this.item = item;
        this.quantity = quantity
        this.items = [];
        this.price = this.pricechart(`${this.item}`)
    }
    pricechart(choice) {
        let price = 0;
        let msg = '';
        switch (choice) {
            case 'Chicken':
                price = 200;
                break;
            case 'Paneer':
                price = 150;
                break;
            case 'Chole Bhature':
                price = 130;
                break;
            case 'Kadhi Chawal':
                price = 110;
                break;
            case 'Idli vada':
                price = 60;
                break;
            case 'Masala Dosa':
                price = 80;
                break;
            case 'Utapam':
                price = 60;
                break;
            case 'Burger':
                price = 110;
                break;
            case 'Pizza':
                price = 220;
                break;
            case 'Pasta':
                price = 150;
                break;
            case 'KFC chicken':
                price = 250;
                break;
            default:
                msg = "This item is not available at our restaurant";
                return msg;
        }
        return price;
    }
}
// const food = 'Utapam'
// let user = new order('','','','','','')
// user.item = `${food}`
// console.log(user.this.pricechart(''))
module.exports.order = order