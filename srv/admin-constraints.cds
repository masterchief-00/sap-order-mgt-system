using {AdminService as Service} from './admin-service';

annotate Service.Products with {
    title       @mandatory  @assert.format: '^[A-Za-z0-9. ]';
    description @assert.format: '^[A-Za-z0-9. ]';
    price       @assert.range : [
        1,
        _
    ];
    stock       @assert.range : [
        (0),
        _
    ];
    expiryDate  @mandatory
};
