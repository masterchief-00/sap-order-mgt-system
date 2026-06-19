sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ns/orders/test/integration/pages/OrdersList",
	"ns/orders/test/integration/pages/OrdersObjectPage",
	"ns/orders/test/integration/pages/OrderItemsObjectPage"
], function (JourneyRunner, OrdersList, OrdersObjectPage, OrderItemsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ns/orders') + '/test/flp.html#app-preview',
        pages: {
			onTheOrdersList: OrdersList,
			onTheOrdersObjectPage: OrdersObjectPage,
			onTheOrderItemsObjectPage: OrderItemsObjectPage
        },
        async: true
    });

    return runner;
});

