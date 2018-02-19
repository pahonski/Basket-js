function Basket(idBasket) {
    Container.call(this, idBasket);
    this.countGoods = 0; //Кол-во товаров
    this.amountGoods = 0; //Общая стоимость товаров
    this.basketItems = []; //Массив для хранения товаров


    this.loadBasketItems();
    this.drop();

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

           var $countGoods = $('<p>Кол-во товаров в корзине:<br>'+ this.countGoods +'</p>');
           var $priceGoods = $('<p>Общая стоимость товаров:<br>'+ this.amountGoods +' руб.</p>');

           this.btnCount(this.countGoods);

           $countGoods.appendTo($basketData);
           $priceGoods.appendTo($basketData);
           $basketData.appendTo($(appendClass));

           for (var itemKey in data.basket) {
               this.basketItems.push(data.basket[itemKey]);
           }
       }
    });
};

Basket.prototype.add = function (name, id, price, img) {
    var basketItem = {
        "id_product": id,
        "price": price
    };

    this.countGoods++;
    this.amountGoods += price;
    this.basketItems.push(basketItem);
    this.refresh();
    this.generateBasketItem(name, id, price, img);

};

Basket.prototype.refresh = function () {
    var $basketData = $('.basket_data');
    $basketData.empty();
    var $countGoods = $('<p>Кол-во товаров в корзине:<br>'+ this.countGoods +'</p>');
    var $priceGoods = $('<p>Общая стоимость товаров:<br>'+ this.amountGoods +' руб.</p>');

    this.btnCount(this.countGoods);

    $countGoods.appendTo($basketData);
    $priceGoods.appendTo($basketData);
};

Basket.prototype.generateBasketItem = function (name, id, price, img) {
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

    var $title = $('<span />', {
        class: 'basket_item-title',
        text: name
    });

    var $price = $('<span />', {
        class: 'price',
        text: price
    });

    var $img = $('<div class="img-container"><img src="'+ img +'"></div>');

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

    $contentItem.append($title);
    $contentItem.append($price);
    $contentItem.append($img);
    $deleteButton.appendTo($contentItem);
    $contentItem.appendTo('.basket_content-items');

};

Basket.prototype.display = function () {
    var $basketWrapper = $('.basket-wrapper');
    if ($basketWrapper.hasClass('active')) {
        $basketWrapper.removeClass('active');
    } else {
        $basketWrapper.addClass('active');
    }

};

Basket.prototype.btnCount = function (count) {
    var $btnBasketItems = $('.btn_basket-items');
    if (count > 0) {
        $btnBasketItems.css({
            display: "inline-block"
        });
        $btnBasketItems[0].innerText = this.countGoods;
    } else {

        $btnBasketItems.css({
            display: "none"
        })
    }

    var that = this;
    $('.btn-basket').droppable({
        drop: function (event, ui) {
            var $uiTitle = ui.draggable.find('.good-title').text();
            var $uiId = ui.draggable.find('.buy-button').data("id");
            var $uiPrice = parseInt(ui.draggable.find('.price-container .price').text());
            var $uiImg = ui.draggable.find('.img-container img').attr("src");
            that.add($uiTitle, $uiId, $uiPrice, $uiImg);

        }
    });

};

Basket.prototype.drop = function () {
    var that = this;
    $('.basket-wrapper').droppable({
        drop: function (event, ui) {
            var $uiTitle = ui.draggable.find('.good-title').text();
            var $uiId = ui.draggable.find('.buy-button').data("id");
            var $uiPrice = parseInt(ui.draggable.find('.price-container .price').text());
            var $uiImg = ui.draggable.find('.img-container img').attr("src");
            that.add($uiTitle, $uiId, $uiPrice, $uiImg);
        }
    });
};

