import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/dashboard/';

// const CATEGORY_META = Object.freeze([
//     {
//         category_id: 1001,
//         parent_id: 100,
//         parent_name: 'Apparel & Accessories',
//         product_category: 'Fashion'
//     },
//     {
//         category_id: 1002,
//         parent_id: 200,
//         parent_name: 'Consumer Electronics',
//         product_category: 'Electronics'
//     },
//     {
//         category_id: 1003,
//         parent_id: 300,
//         parent_name: 'Home & Living',
//         product_category: 'Home & Living'
//     }
// ]);
// const toCurrencyString = (value) => Number(value ?? 0).toFixed(2);
// const freezeEntries = (rows) =>
//     Object.freeze(
//         rows.map((entry) =>
//             Object.freeze({
//                 ...entry,
//                 categories: Object.freeze(entry.categories.map((category) => Object.freeze(category)))
//             })
//         )
//     );
// const createOverviewEntries = (rows) => {
//     return rows.map(({ period, amounts = [], total }) => {
//         const normalizedAmounts = CATEGORY_META.map((meta, index) => {
//             const amountValue = amounts[index] ?? 0;
//             return {
//                 ...meta,
//                 total_amount: toCurrencyString(amountValue)
//             };
//         });
//         const computedTotal =
//             typeof total === 'number'
//                 ? total
//                 : amounts.reduce((acc, amount) => acc + Number(amount ?? 0), 0);
//         return {
//             week: period,
//             total_amount: toCurrencyString(computedTotal),
//             categories: normalizedAmounts
//         };
//     });
// };
// const OVERVIEW_WIDGET_DEMO = Object.freeze({
//     weekly: freezeEntries(
//         createOverviewEntries([
//             { period: '2024-07-29', amounts: [17640.22, 18854.91, 9520.33] },
//             { period: '2024-08-05', amounts: [18210.75, 19040.28, 10012.64] },
//             { period: '2024-08-12', amounts: [17985.63, 19542.11, 9842.37] },
//             { period: '2024-08-19', amounts: [18540.88, 20115.47, 10220.54] },
//             { period: '2024-08-26', amounts: [19122.34, 20580.12, 10875.96] },
//             { period: '2024-09-02', amounts: [19810.42, 21234.75, 11120.65] },
//             { period: '2024-09-09', amounts: [20234.51, 21980.31, 11495.22] },
//             { period: '2024-09-16', amounts: [20845.63, 22510.42, 11806.37] },
//             { period: '2024-09-23', amounts: [21420.54, 23125.88, 12154.98] },
//             { period: '2024-09-30', amounts: [21985.76, 23840.12, 12540.73] },
//             { period: '2024-10-07', amounts: [22590.13, 24560.98, 12955.44] },
//             { period: '2024-10-14', amounts: [23245.88, 25234.61, 13342.57] }
//         ])
//     ),
//     monthly: freezeEntries(
//         createOverviewEntries([
//             { period: '2023-11-01', amounts: [68850.12, 80210.45, 45120.18] },
//             { period: '2023-12-01', amounts: [70230.48, 81895.32, 46305.77] },
//             { period: '2024-01-01', amounts: [71860.22, 83410.67, 47450.33] },
//             { period: '2024-02-01', amounts: [72540.17, 84520.11, 48130.49] },
//             { period: '2024-03-01', amounts: [73985.65, 85990.44, 49214.05] },
//             { period: '2024-04-01', amounts: [75210.38, 87215.67, 50325.48] },
//             { period: '2024-05-01', amounts: [76890.42, 88845.73, 51410.56] },
//             { period: '2024-06-01', amounts: [78105.51, 90230.85, 52655.37] },
//             { period: '2024-07-01', amounts: [79560.73, 91840.42, 53820.14] },
//             { period: '2024-08-01', amounts: [80945.68, 93215.26, 54965.80] },
//             { period: '2024-09-01', amounts: [82320.11, 94810.54, 56320.47] },
//             { period: '2024-10-01', amounts: [83655.47, 96245.31, 57584.66] }
//         ])
//     ),
//     quarterly: freezeEntries(
//         createOverviewEntries([
//             { period: '2022-01-01', amounts: [201340.12, 225890.55, 145678.33] },
//             { period: '2022-04-01', amounts: [208765.45, 231234.7, 149542.18] },
//             { period: '2022-07-01', amounts: [215432.88, 238905.12, 153214.56] },
//             { period: '2022-10-01', amounts: [222876.54, 245678.43, 157890.11] },
//             { period: '2023-01-01', amounts: [229345.77, 252890.67, 162345.84] },
//             { period: '2023-04-01', amounts: [236890.15, 259432.88, 166998.27] },
//             { period: '2023-07-01', amounts: [243765.64, 267210.34, 171234.55] },
//             { period: '2023-10-01', amounts: [251234.88, 275654.21, 175876.92] }
//         ])
//     ),
//     yearly: freezeEntries(
//         createOverviewEntries([
//             { period: '2020-01-01', amounts: [612340.22, 702890.11, 412345.56] },
//             { period: '2021-01-01', amounts: [645230.55, 732450.48, 428765.34] },
//             { period: '2022-01-01', amounts: [678945.12, 764320.67, 445210.98] },
//             { period: '2023-01-01', amounts: [712345.78, 798210.45, 462890.15] },
//             { period: '2024-01-01', amounts: [748920.33, 834560.12, 481230.64] }
//         ])
//     )
// });
// const OVERVIEW_TYPE_ALIAS = Object.freeze({
//     week: 'weekly',
//     weeks: 'weekly',
//     weekly: 'weekly',
//     month: 'monthly',
//     months: 'monthly',
//     monthly: 'monthly',
//     quarter: 'quarterly',
//     quarters: 'quarterly',
//     quarterly: 'quarterly',
//     year: 'yearly',
//     years: 'yearly',
//     yearly: 'yearly'
// });
// const cloneOverviewEntry = (entry) => ({
//     ...entry,
//     categories: Array.isArray(entry.categories)
//         ? entry.categories.map((category) => ({ ...category }))
//         : []
// });
// const resolveOverviewEntries = (entries) => entries.map((entry) => cloneOverviewEntry(entry));

/**
 * not all api are implemented yet
 * ************************************************** 
 * 1. dashboard/revenue-card-widget
 * 2. dashboard/overview-widget
 * 3. dashboard/pinboards-widget
 * 4. dashboard/recent-quotes-widget
 * 5. dashboard/recent-orders-widget
 * ************************************************** 
*/

class DashboardService {
    // Get revenue card widget
    static getRevenueCardWidget() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'revenue-card-widget')
                .then(response => {
                    resolve(response.data);
                    
                })
                .catch(error => {
                    console.error('Error fetching revenue card widget:', error);
                    reject(error);
                });
        });
    }

    // Get overview widget
    static getOverviewWidget(type = 'weekly') {
        return new Promise((resolve) => {
            // const key = OVERVIEW_TYPE_ALIAS[type?.toLowerCase?.()] ?? 'weekly';
            // const entries = OVERVIEW_WIDGET_DEMO[key] ?? OVERVIEW_WIDGET_DEMO.weekly;
            // call api to get overview widget
            axios.get(API_URL + 'overview-widget?type=' + type)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching overview widget:', error);
                    reject(error);
                });
            // resolve(resolveOverviewEntries(entries));
        });
    }

    // Get pinboards widget
    static getRecentActivitiesWidget() {
        return new Promise((resolve, reject) => {

            axios.get(API_URL + 'pinboards-widget?limit=15')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboards widget:', error);
                    reject(error);
                });
        });
    }

    static getSeeAllRecentActivities() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'pinboards-widget?limit=0')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboards widget:', error);
                    reject(error);
                });
        });
    }
    // Get recent quotes widget
    static getRecentQuotesWidget(limit) {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'recent-quotes-widget?limit=' + limit)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching recent quotes widget:', error);
                    reject(error);
                });
        });
    }

    // Get recent orders widget
    static getRecentOrdersWidget(limit) {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'recent-orders-widget?limit=' + limit)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching recent orders widget:', error);
                    reject(error);
                });
        });
    }

    static getTransactionDetails(row) {
        // return new Promise((resolve, reject) => {
        //     axios.get(API_URL + 'transaction-details-widget?order_id=' + row.id)
        //     .then(response => {
        //         resolve(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching order transaction details:', error);
        //         reject(error);
        //     });
        // });
        return {
            transactionDetails: [
                {
                    account: row.account,
                    amount: row.amount,
                    customer_name: row.customer_name,
                    date: row.date,
                    description: row.description,
                    id: row.id,
                    name:[
                        {
                            bgColor: row.bgColor,
                            capName: row.capName,
                            value: row.value,
                        }
                    ],
                    reference: row.reference,
                    status: row.status,
                    updated_at: row.updated_at,
                }
            ]
        };  
    }
    // Get pinboards widget
    static getPinboardsWidget() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'pinboards-widget')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching pinboards widget:', error);
                    reject(error);
                });
        });
    }
    static getRevenueCardDetailsWidget(card_type) {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'revenue-card-details?card_type=' + card_type)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching revenue pinboard details:', error);
                    reject(error);
                });
        });
    }

}

export default DashboardService; 