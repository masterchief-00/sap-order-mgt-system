using FioriAdminService as service from '../../srv/admin-service';
annotate service.User with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Names',
                Value : names,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Value : createdAt,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedAt,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Activity Summary',
            ID : 'Activity',
            Target : '@UI.FieldGroup#Activity',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Orders Summary',
            ID : 'Orders',
            Target : 'orders/@UI.LineItem#Orders',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Names',
            Value : names,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Email',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Orders Count',
            Value : ordersCount,
        },
        {
            $Type : 'UI.DataField',
            Value : avgItemsPerOrder,
            Label : 'Items Per Order (AVG)',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Reviews Count',
            Value : reviewsCount,
        },
        {
            $Type : 'UI.DataField',
            Value : avgRating,
            Label : 'Average Rating',
        },
        {
            $Type : 'UI.DataField',
            Value : totalRevenue,
            Label : 'Total Revenue',
        },
    ],
    UI.FieldGroup #Activity : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ordersCount,
                Label : 'Total Orders',
            },
            {
                $Type : 'UI.DataField',
                Value : reviewsCount,
                Label : 'Total Reviews',
            },
            {
                $Type : 'UI.DataField',
                Value : avgRating,
                Label : 'Average Rating',
            },
            {
                $Type : 'UI.DataField',
                Value : totalRevenue,
                Label : 'Total Revenue',
            },
        ],
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : names,
        },
        TypeName : '',
        TypeNamePlural : '',
        TypeImageUrl : 'https://cdn3.iconfinder.com/data/icons/user-group-black/100/user-512.png',
        Description : {
            $Type : 'UI.DataField',
            Value : email,
        },
    },
);

annotate service.Orders with @(
    UI.LineItem #Orders : [
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'Amount Paid',
        },
    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
        TypeName : '',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : status,
        },
        Initials : customer.email,
        TypeImageUrl : 'https://png.pngtree.com/png-clipart/20231004/original/pngtree-icon-indicating-package-delivery-with-confirmation-of-order-reaching-destination-vector-png-image_12952005.png',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Metadata',
            ID : 'OrderDetails',
            Target : '@UI.FieldGroup#OrderDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Order Details',
            ID : 'OrderDetails1',
            Target : '@UI.FieldGroup#OrderDetails1',
        },
    ],
    UI.FieldGroup #OrderDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : createdAt,
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedAt,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
            },
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
        ],
    },
    UI.FieldGroup #OrderDetails1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'Completion Status',
            },
            {
                $Type : 'UI.DataField',
                Value : totalPrice,
                Label : 'Total Price',
            },
            {
                $Type : 'UI.DataField',
                Value : customer_ID,
                Label : 'Buyer',
            },
        ],
    },
);

annotate service.Orders with {
    customer @Common.ExternalID : customer.names
};

