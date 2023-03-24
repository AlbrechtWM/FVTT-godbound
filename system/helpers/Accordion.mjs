export default class {
    constructor(el, clickElementName, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;
        const clickElement = el.find(`.${clickElementName}`);

        clickElement.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
    }

    dropdown(e) {
        const { el, multiple } = e.data;
        console.log(next);
        const next = $(this).parent().next();

        next.slideToggle();

        $(this).parent().toggleClass('open');
        if (!multiple) {
            el.find('.accordion-sub-item').not(next).slideUp().parent().removeClass('open');
        };
    }
};
