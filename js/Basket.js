function Basket(idBasket) {
    Container.call(this, idBasket);
    this.countGoods = 0; //Кол-во товаров
    this.amountGoods = 0; //Общая стоимость товаров
    this.basketItems = []; //Массив для хранения товаров

    this.loadBasketItems();

}

Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;

Basket.prototype.render = function () {
    var $basketWrapper = $('.basket-wrapper');

    var $basketDiv = $('<div />', {
        class: this.class
    });

    var $basketItemsDiv = $('<div />', {
        class: this.class + '_items'
    });

    var $basketContent = $('<div />', {
        class: this.class + '_content'
    });

    var $basketContentItems = $('<div />', {
        class: this.class + '_content-items'
    });


    $basketItemsDiv.appendTo($basketDiv);
    $basketDiv.appendTo($basketWrapper );
    $basketContentItems.appendTo($basketContent);
    $basketContent.appendTo($basketWrapper );
};

Basket.prototype.loadBasketItems = function () {
    var appendClass = '.' + this.class + '_items';
    var that = this;

    $.get({
       url: './basket.json',
       context: this,
       dataType: 'json',
       success: function (data) {
           var $basketData = $('<div />', {
               class: "basket_data"
           });

           data.basket.forEach(function (item) {
               that.generateBasketItem(item.id_product, item.price);
           });

           this.countGoods = data.basket.length;
           this.amountGoods = data.amount;

           var $countGoods = $('<p>Кол-во товаров в корзине:'+ this.countGoods +'</p>');
           var $priceGoods = $('<p>Общая стоимость товаров:'+ this.amountGoods +' руб.</p>');

           $countGoods.appendTo($basketData);
           $priceGoods.appendTo($basketData);
           $basketData.appendTo($(appendClass));

           for (var itemKey in data.basket) {
               this.basketItems.push(data.basket[itemKey]);
           }
       }
    });
};

Basket.prototype.add = function (id, price) {
    var basketItem = {
        "id_product": id,
        "price": price
    };

    this.countGoods++;
    this.amountGoods += price;
    this.basketItems.push(basketItem);
    this.refresh();
    this.generateBasketItem(id, price);

};

Basket.prototype.refresh = function () {
    var $basketData = $('.basket_data');
    $basketData.empty();
    var $countGoods = $('<p>Кол-во товаров в корзине:'+ this.countGoods +'</p>');
    var $priceGoods = $('<p>Общая стоимость товаров:'+ this.amountGoods +' руб.</p>');



    $countGoods.appendTo($basketData);
    $priceGoods.appendTo($basketData);
};

Basket.prototype.generateBasketItem = function (id, price) {
    var counter = null;
    var that = this;
    var $deleteButtons = $('.delete-button');

    if ($deleteButtons.length === 0) {
        counter = 0;
    } else {
        counter = $deleteButtons.length;
    }

    var $contentItem = $('<div />', {
        class: "basket_content-item",
        'data-id': id
    });

    var $price = $('<span />', {
        class: 'price',
        text: price
    });

    var $deleteButton = $('<button />', {
        type: 'button',
        class: "delete-button",
        text: 'x',
        'data-item-key': counter
    });

    $deleteButton.on('click', function () {
        var newPrice = that.basketItems[parseInt($(this).attr('data-item-key'))].price;
        that.countGoods--;
        that.amountGoods -= newPrice;
        that.refresh();
        that.basketItems[parseInt($(this).attr('data-item-key'))] = undefined;
        $(this).parent().remove();

        var clearBasket = that.basketItems.every(function (item) {
            return item === undefined;
        });

        if (clearBasket) {
            that.basketItems = [];
        }
    });

    $contentItem.append($price);
    $deleteButton.appendTo($contentItem);
    $contentItem.appendTo('.basket_content-items');




};