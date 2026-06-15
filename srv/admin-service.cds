using {sap.capire.oms as my} from '../db/schema';

service AdminService @(
    requires: 'authenticated-user',
    odata   : '/admin'
) {
    @odata.draft.enabled
    entity Products   as projection on my.Products;

    @odata.draft.enabled
    entity Orders     as projection on my.Orders;

    @odata.draft.enabled
    entity OrderItems as projection on my.OrderItems;

    @odata.draft.enabled
    entity User       as projection on my.User;
}
