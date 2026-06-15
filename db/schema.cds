using {managed} from '@sap/cds/common';

namespace sap.capire.oms;

entity Products : managed {
    key ID          : UUID;
        title       : localized String;
        description : localized String;
        price       : Decimal;
        stock       : Integer;
        expiryDate  : Date;
        sales       : Association to many OrderItems
                          on sales.product = $self;
        reviews     : Composition of many Reviews;
}

entity User : managed {
    key ID     : UUID;
        names  : String;
        email  : String;
        orders : Association to many Orders
                     on orders.customer = $self;
}

entity Orders : managed {
    key ID         : UUID;
        customer   : Association to User;
        items      : Association to many OrderItems
                         on items.order = $self;
        totalPrice : Decimal;
        status     : String enum {
            completed = 'Completed';
            pending = 'Pending';
            cancelled = 'Cancelled'
        }
}

entity OrderItems : managed {
    key ID         : UUID;
        product    : Association to Products;
        order      : Association to Orders;
        quantity   : Integer;
        unit_price : Decimal;
}

aspect Reviews : managed {
    key ID       : UUID;
        reviewer : Association to User;
        rating   : Decimal;
        comment  : String;
}
