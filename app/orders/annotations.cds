using FioriAdminService as service from '../../srv/admin-service';
annotate service.Orders with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : customer_ID,
            Label : 'Customer',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Total Price',
            Value : totalPrice,
        },
        {
            $Type : 'UI.DataField',
            Value : itemsCount,
            Label : 'Items Count',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Completion Status',
            Value : status,
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
        {
            $Type : 'UI.DataField',
            Value : modifiedAt,
        },
    ]
);

annotate service.Orders with {
    customer @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'User',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : customer_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'names',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'email',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'ordersCount',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'reviewsCount',
                },
            ],
        },
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    totalPrice @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    status @Common.ExternalID : status
};

