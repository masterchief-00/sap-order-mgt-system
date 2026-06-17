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
    entity Orders     as projection on my.Orders;

    entity OrderItems as projection on my.Orders.items;

    @odata.draft.enabled
    entity User       as projection on my.User;
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
