using {sap.capire.oms as my} from '../db/schema';

service FioriAdminService @(
    requires: 'authenticated-user',
    odata   : '/fiori/admin'
) {
    @odata.draft.enabled
    entity Products   as
        projection on my.Products {
            *,
            virtual 2 as stockCriticality : Integer,
            virtual 0 as reviewCount      : Integer,
            virtual 0 as averageRating    : Decimal
        };

    @odata.draft.enabled
    entity Orders     as
        projection on my.Orders {
            *,
            virtual 0 as itemsCount : Integer
        };

    entity OrderItems as projection on my.Orders.items;

    entity User       as
        projection on my.User {
            *,
            virtual 0    as ordersCount      : Integer,
            virtual 0    as reviewsCount     : Integer,
            virtual 0.00 as totalRevenue     : Decimal(10, 2),
            virtual 0.0  as avgRating        : Decimal(10, 1),
            virtual 0.00 as avgItemsPerOrder : Decimal(5, 2)
        };
}

service AdminService @(
    requires: 'authenticated-user',
    odata   : '/admin'
) {
    entity Products   as projection on my.Products;

    entity Orders     as projection on my.Orders;

    entity OrderItems as projection on my.Orders.items;

    entity User       as projection on my.User;
}
