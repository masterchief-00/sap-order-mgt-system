sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ns/customer/test/integration/pages/UserList",
	"ns/customer/test/integration/pages/UserObjectPage",
	"ns/customer/test/integration/pages/OrdersObjectPage"
], function (JourneyRunner, UserList, UserObjectPage, OrdersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ns/customer') + '/test/flp.html#app-preview',
        pages: {
			onTheUserList: UserList,
			onTheUserObjectPage: UserObjectPage,
			onTheOrdersObjectPage: OrdersObjectPage
        },
        async: true
    });

    return runner;
});

