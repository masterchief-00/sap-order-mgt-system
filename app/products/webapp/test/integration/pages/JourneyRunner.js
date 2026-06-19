sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ns/products/test/integration/pages/ProductsList",
	"ns/products/test/integration/pages/ProductsObjectPage",
	"ns/products/test/integration/pages/Products_reviewsObjectPage"
], function (JourneyRunner, ProductsList, ProductsObjectPage, Products_reviewsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ns/products') + '/test/flp.html#app-preview',
        pages: {
			onTheProductsList: ProductsList,
			onTheProductsObjectPage: ProductsObjectPage,
			onTheProducts_reviewsObjectPage: Products_reviewsObjectPage
        },
        async: true
    });

    return runner;
});

