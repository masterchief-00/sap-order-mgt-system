using {sap.capire.oms as my} from '../db/schema';

service AdminService @(
    requires: 'authenticated-user',
    odata   : '/admin'
) {
    @odata.draft.enabled
    entity Products   as projection on my.Products;

    @odata.draft.enabled
    entity Orders     as projection on my.Orders;

    entity OrderItems as projection on my.Orders.items;

    @odata.draft.enabled
    entity User       as projection on my.User;
}
