using {managed} from '@sap/cds/common';

namespace sap.capire.oms;

entity Products : managed {
    key ID          : UUID;
        title       : localized String;
        description : localized String;
        price       : Decimal;
        stock       : Integer;
        expiryDate  : Date;
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
        items      : Composition of many OrderItems;
        totalPrice : Decimal;

        @assert.range
        @Common.ValueListWithFixedValues: true
        status     : String enum {
            Pending = 'Pending';
            Cancelled = 'Cancelled';
            Completed = 'Completed';
        }
}

aspect OrderItems : managed {
    key ID         : UUID;
        product    : Association to Products;
        quantity   : Integer;
        unit_price : Decimal;
}

aspect Reviews : managed {
    key ID       : UUID;
        reviewer : Association to User;
        rating   : Decimal;
        comment  : String;
}
