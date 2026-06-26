using FioriAdminService as service from '../../srv/admin-service';
using from '../../db/schema';

annotate service.Products with @(
    UI.FieldGroup #GeneratedGroup           : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Product title',
                Value: title,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Description',
                Value: description,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Price',
                Value: price,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Stock',
                Value: stock,
            },
            {
                $Type: 'UI.DataField',
                Value: reviewCount,
                Label: 'Number reviews',
            },
            {
                $Type: 'UI.DataField',
                Value: averageRating,
                Label: 'Overall Rating',
            },
            {
                $Type: 'UI.DataField',
                Label: 'Expires on',
                Value: expiryDate,
            },
        ],
    },
    UI.Facets                               : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : 'General Information',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'More Details',
            ID    : 'MoreDetails',
            Target: '@UI.FieldGroup#MoreDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Reviews Submitted',
            ID    : 'ReviewsSubmitted',
            Target: 'reviews/@UI.LineItem#ReviewsSubmitted',
        },
    ],
    UI.LineItem                             : [
        {
            $Type: 'UI.DataField',
            Value: title,
            Label: 'Title',
        },
        {
            $Type         : 'UI.DataField',
            Label         : 'Description',
            Value         : description,
            @UI.Importance: #High,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Price ($)',
            Value: price,
        },
        {
            $Type                    : 'UI.DataField',
            Label                    : 'Stock',
            Value                    : stock,
            Criticality              : stockCriticality,
            CriticalityRepresentation: #WithoutIcon,
        },
        {
            $Type: 'UI.DataField',
            Value: reviewCount,
            Label: 'Reviews',
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target: '@UI.DataPoint#averageRating',
            Label : 'Average Rating',
        },
        {
            $Type: 'UI.DataField',
            Label: 'Expiry Date',
            Value: expiryDate,
        },
        {
            $Type: 'UI.DataField',
            Value: createdAt,
            @UI.Hidden,
        },
    ],
    UI.DataPoint #averageRating             : {
        Value            : averageRating,
        Visualization    : #Rating,
        TargetValue      : 5,
        @Common.QuickInfo: 'Average rating pulled from the reviews',
    },
    UI.HeaderInfo                           : {
        Title         : {
            $Type: 'UI.DataField',
            Value: title,
        },
        TypeName      : '',
        TypeNamePlural: '',
        Description   : {
            $Type: 'UI.DataField',
            Value: description,
        },
        TypeImageUrl  : 'https://tse1.mm.bing.net/th/id/OIP.aklObbWZEUA6B6ezrInPjAHaHa?w=800&h=800&rs=1&pid=ImgDetMain&o=7&rm=3',
    },
    UI.FieldGroup #MoreDetails              : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: createdAt,
            },
            {
                $Type: 'UI.DataField',
                Value: createdBy,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedAt,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedBy,
            },
        ],
    },
    Aggregation.ApplySupported              : {
        Transformations       : [
            'aggregate',
            'groupby',
            'filter'
        ],
        GroupableProperties   : [title],
        AggregatableProperties: [{Property: stock}]
    },
    Analytics.AggregatedProperty #totalStock: {
        Name                : 'stock',
        AggregationMethod   : 'sum',
        AggregatableProperty: stock,
        ![@Common.Label]    : 'Stock'
    },
    UI.Chart #stockChart                    : {
        ChartType          : #Bar,
        Dimensions         : [title],
        DimensionAttributes: [{
            Dimension: title,
            Role     : #Category
        }],
        DynamicMeasures    : [ ![@Analytics.AggregatedProperty#totalStock] ],
        MeasureAttributes  : [{
            DynamicMeasures: ![@Analytics.AggregatedProperty#totalStock],
            Role           : #Axis1
        }]
    },
    UI.SelectionPresentationVariant #spvDefault: {
        SelectionVariant   : {SelectOptions: []},
        PresentationVariant: {
            Text          : 'Default',
            Visualizations: [
                ![@UI.Chart#stockChart],
                ![@UI.LineItem]
            ]
        }
    }
);

annotate service.Products.reviews with @(
    UI.LineItem #ReviewsSubmitted   : [
        {
            $Type: 'UI.DataField',
            Value: reviewer.names,
            Label: 'Customer Names',
        },
        {
            $Type: 'UI.DataField',
            Value: comment,
            Label: 'Comment',
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target: '@UI.DataPoint#rating',
            Label : 'Rating',
        },
        {
            $Type: 'UI.DataField',
            Value: createdAt,
        },
    ],
    UI.DataPoint #rating            : {
        Value        : rating,
        Visualization: #Rating,
        TargetValue  : 5,
    },
    UI.Facets                       : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Review Information',
            ID    : 'ReviewInformation',
            Target: '@UI.FieldGroup#ReviewInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'More Details',
            ID    : 'MoreDetails',
            Target: '@UI.FieldGroup#MoreDetails',
        },
    ],
    UI.FieldGroup #ReviewInformation: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: reviewer_ID,
                Label: 'Reviewer',
            },
            {
                $Type: 'UI.DataField',
                Value: rating,
                Label: 'Rating',
            },
            {
                $Type: 'UI.DataField',
                Value: comment,
                Label: 'Comment',
            },
            {
                $Type: 'UI.DataField',
                Value: createdAt,
            },
        ],
    },
    UI.FieldGroup #MoreDetails      : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: modifiedAt,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedBy,
            },
            {
                $Type: 'UI.DataField',
                Value: createdBy,
            },
        ],
    },
    UI.HeaderInfo                   : {
        Title         : {
            $Type: 'UI.DataField',
            Value: reviewer.names,
        },
        TypeName      : '',
        TypeNamePlural: '',
        TypeImageUrl  : 'https://tse1.mm.bing.net/th/id/OIP.SXkUwphMyUJ5U4OgehuHBQHaHc?w=860&h=865&rs=1&pid=ImgDetMain&o=7&rm=3',
    },
);

annotate service.User with {
    names @(
        Common.FieldControl            : #Mandatory,
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'User',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: names,
                ValueListProperty: 'names',
            }, ],
            Label         : 'User names',
        },
        Common.ValueListWithFixedValues: true,
    )
};

annotate service.Products.reviews with {
    reviewer @(
        Common.ExternalID              : reviewer.names,
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'User',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: reviewer_ID,
                ValueListProperty: 'ID',
            }, ],
            Label         : 'Reviewer',
        },
        Common.ValueListWithFixedValues: true,
        Common.FieldControl            : #Mandatory,
    )
};
