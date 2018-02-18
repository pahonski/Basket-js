function Good(title, price, id, imgUrl) {
    Container.call(this);
    this.name = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.id = id;
}

Good.prototype = Object.create(Container.prototype);
Good.prototype.constructor = Good;

Good.prototype.render = function () {
    var $goodContainer = $('<div />', {
        class: 'good-container'
    });

    var $goodImage = $('<div class="img-container"><img src="' + this.imgUrl +'"></div>');

    var $goodName = $('<p />', {
        class: 'good-title',
        text: this.name
    });

    var $goodPrice = $('<p class="price-container"><span class="price">' + this.price + '</span> руб.</p>');

    var $buyButton = $('<button />', {
        class: 'buy-button',
        text: 'Купить',
        type: 'button',
        'data-id': this.id
    });

    $goodName.appendTo($goodContainer);
    if (this.imgUrl !== undefined) {
        $goodImage.appendTo($goodContainer);
    }
    $goodPrice.appendTo($goodContainer);
    $buyButton.appendTo($goodContainer);
    $('.goods').append($goodContainer);
};

