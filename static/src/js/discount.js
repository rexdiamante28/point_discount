odoo.define('pos_discount.pos_discount', function (require) {
"use strict";

var screens = require('point_of_sale.screens');


var DiscountButton = screens.ActionButtonWidget.extend({
    template: 'DiscountButton',
    button_click: function(){
        var self = this;
        this.gui.show_popup('number',{
            'title': 'Discount Percentage',
            'value': this.pos.config.discount_pc,
            'confirm': function(val) {
                val = Math.round(Math.max(0,Math.min(100,val)));
                self.apply_discount(val);
            },
        });
    },
    apply_discount: function(pc) {
        var order    = this.pos.get_order();
        var lines    = order.get_orderlines();
        var product  = this.pos.db.get_product_by_id(this.pos.config.discount_product_id[0]);

        // Remove existing discounts
        var i = 0;
        while ( i < lines.length ) {
            if (lines[i].get_product() === product) {
                order.remove_orderline(lines[i]);
            } else {
                i++;
            }
        }

        // Add discount
        var discount = - pc / 100.0 * order.get_total_with_tax();

        if( discount < 0 ){
            order.add_product(product, { price: discount });
        }
    },
});

screens.define_action_button({
    'name': 'discount',
    'widget': DiscountButton,
    'condition': function(){
        return this.pos.config.iface_discount && this.pos.config.discount_product_id;
    },
});


var DiscountButtonSCD = screens.ActionButtonWidget.extend({
    template: 'DiscountButtonSCD',
    button_click: function(){
        var self = this;
        this.gui.show_popup('discountpopup',{
            'title': 'SENIOR CITIZEN DETAILS',
            'value': '',
            'confirm': function(val) {
                self.apply_discount(12,val);
            },
        });
    },
    apply_discount: function(pc,scn) {
        var order    = this.pos.get_order();
        var disc_desc = "Senior Citizen(ID #:"+ scn.ref_id +")";
        order.get_selected_orderline().set_discount(pc, disc_desc);

    },
});


screens.define_action_button({
    'name': 'discountscd',
    'widget': DiscountButtonSCD,
    'condition': function(){
        return this.pos.config.iface_discount && this.pos.config.discount_product_id;
    },
});


var DiscountButtonPWD = screens.ActionButtonWidget.extend({
    template: 'DiscountButtonPWD',
    button_click: function(){
        var self = this;
        self.apply_discount(12);
    },
    apply_discount: function(pc) {
        var order    = this.pos.get_order();
        //var mode = OrderWidget.numpad_state.get('mode');
        //if( mode === 'discount'){
        //    order.get_selected_orderline().set_discount(pc);
        //}

        order.get_selected_orderline().set_discount(pc, "PWD");
    },
});


screens.define_action_button({
    'name': 'discountpwd',
    'widget': DiscountButtonPWD,
    'condition': function(){
        return this.pos.config.iface_discount && this.pos.config.discount_product_id;
    },
});


var DiscountButtonEDISC = screens.ActionButtonWidget.extend({
    template: 'DiscountButtonEDISC',
    button_click: function(){
        var self = this;
        this.gui.show_popup('discountpopup',{
            'title': 'Reference Number',
            'value': '',
            'confirm': function(val) {
                self.apply_discount(10, val);
            },
        });
    },
    apply_discount: function(pc, rfn) {
        var order    = this.pos.get_order();
        var lines    = order.get_orderlines();
        var product  = this.pos.db.get_product_by_id(this.pos.config.discount_product_id[0]);

        console.log(rfn);

        var disc_desc = "Employee (ref #:"+ rfn.ref_id +")";
        order.get_selected_orderline().set_discount(pc, disc_desc);
    },
});


screens.define_action_button({
    'name': 'discountedisc',
    'widget': DiscountButtonEDISC,
    'condition': function(){
        return this.pos.config.iface_discount && this.pos.config.discount_product_id;
    },
});


});
