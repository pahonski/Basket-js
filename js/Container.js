function Container(iClass) {
    this.htmlCode = '';
    this.class = iClass;
}

Container.prototype.render = function () {
    console.log(this.class);
    return this.htmlCode;
};

Container.prototype.remove = function (item) {

};