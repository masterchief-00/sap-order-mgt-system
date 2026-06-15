using {sap.capire.oms as my} from '../db/schema';

service CustomerService @(odata: '/browse') {
    entity Products @readonly as
        projection on my.Products {
            *
        }
        excluding {
            createdAt,
            createdBy,
            sales
        };

    @odata.draft.enabled
    entity Reviews @(restrict: [
        {
            grant: 'READ',
            to   : 'any'
        },
        {
            grant: 'CREATE',
            to   : 'authenticated-user'
        },
        {
            grant: [
                'UPDATE',
                'DELETE'
            ],
            to   : 'authenticated-user',
            where: 'createdBy = $user'
        }
    ])                        as projection on my.Products.reviews;

    @odata.draft.enabled
    entity Orders @(restrict: [
        {
            grant: 'READ',
            to   : 'authenticated-user',
            where: 'createdBy = $user'
        },
        {
            grant: 'CREATE',
            to   : 'authenticated-user'
        }
    ])                        as projection on my.Orders;

    @odata.draft.enabled
    entity OrderItems @(restrict: [
        {
            grant: 'READ',
            to   : 'authenticated-user',
            where: 'createdBy = $user'
        },
        {
            grant: 'CREATE',
            to   : 'authenticated-user'
        }
    ])                        as projection on my.OrderItems;
}
