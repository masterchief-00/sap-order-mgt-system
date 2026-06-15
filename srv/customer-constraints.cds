using {CustomerService as Service} from './customer-service';

annotate Service.Reviews with {
    rating @asser.range: [
        1,
        5
    ]
}
