using {sap.capire.oms as my} from '../db/schema';

service FioriCustomerService @(odata: '/fiori/browse') {
    entity Products @readonly as
        projection on my.Products {
            *
        }
        excluding {
            createdAt,
            createdBy,
            sales,
            modifiedAt,
            modifiedBy
        };

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
    ])                        as projection on my.Orders.items;
}

service CustomerService @(odata: '/browse') {
    entity Products @readonly as
        projection on my.Products {
            *
        }
        excluding {
            createdAt,
            createdBy,
            sales,
            modifiedAt,
            modifiedBy
        };

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
    ])                        as projection on my.Orders.items;
}
