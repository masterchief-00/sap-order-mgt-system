using FioriAdminService as service from '../../srv/admin-service';
annotate service.Products with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'title',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'price',
                Value : price,
            },
            {
                $Type : 'UI.DataField',
                Label : 'stock',
                Value : stock,
            },
            {
                $Type : 'UI.DataField',
                Label : 'expiryDate',
                Value : expiryDate,
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
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : title,
            Label : 'Title',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Description',
            Value : description,
            @UI.Importance : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Price ($)',
            Value : price,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Stock',
            Value : stock,
            Criticality : stockCriticality,
            CriticalityRepresentation : #WithoutIcon,
        },
        {
            $Type : 'UI.DataField',
            Value : reviewCount,
            Label : 'Reviews',
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target : '@UI.DataPoint#averageRating',
            Label : 'Average Rating',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Expiry Date',
            Value : expiryDate,
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
            @UI.Hidden,
        },
    ],
    UI.DataPoint #stock : {
        Value : stock,
        Visualization : #Progress,
        TargetValue : 100,
    },
    Communication.Contact #contact : {
        $Type : 'Communication.ContactType',
        fn : title,
    },
    UI.DataPoint #averageRating : {
        Value : averageRating,
        Visualization : #Rating,
        TargetValue : 5,
        @Common.QuickInfo : 'Average rating pulled from the reviews',
    },
);

annotate service.Products with {
    ID @(
        Common.Text : title,
        Common.Text.@UI.TextArrangement : #TextLast,
    )
};

