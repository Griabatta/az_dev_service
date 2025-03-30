export const SheetName = (typeRequest: string | undefined) => {
    switch (typeRequest) {
        case "Analytics":
            return "Аналитика";
        case "Stock_Ware":
            return "Остатки";
        case "Transactions":
            return "Отзывы за баллы";
        case "ProductList":
            return "Артикулы магазина";
        default:
            return "";
    };
};


export const keysForAnalytics = [
    'id',
    'Дата запроса',
    'model_id',
    'model',
    'Заказано на сумму',
    'Заказано товаров',
    'Показы в поиске',
    'Показы на карточке товара',
    'Всего показов',
    'В корзину из поиска или категории',
    'В корзину из карточки товара',
    'Всего добавлено в корзину',
    'Уникальные просмотры в поиске или каталоге',
    'Уникальные просмотры карточки товара',
    'Уникальные посетители',
    'Конверсия в корзину из поиска или каталога',
    'Конверсия в корзину из карточки товара',
    'Общая конверсия в корзину',
    'Возвращено товаров',
    'Отменено товаров',
    'Доставлено товаров',
    'Позиция в поиске и в категории',
];


export const keysForStock = [
    'id',
    'Дата запроса',
    'SKU',
    'Склад',
    'Артикул',
    'Имя',
    'Доступно к продаже',
    'В пути',
    'Резерв',
    'IDC'
];

export const keysForTransactions = [
    'id',
    'Дата запроса',
    'operation_id',
    'Тип операции',
    'Дата операции',
    'Название типа операции',
    'Стоимость доставки',
    'Стоимость возврата',
    'Стоимость товара со скидкой продавца',
    'Комиссия',
    'Итоговая сумма операции',
    'Тип начисления',
    'Схема доставки',
    'Дата принятия отправления',
    'Номер отправления',
    'Идентификатор склада',
    'items',
    'services'
];

export const keysForProductList = [
    'id',
    'Дата запроса',
    'Товар в архиве',
    'Есть остатки на fbo',
    'Есть остатки на fbs',
    'Уцененный',
    'Артикул',
    'product_id',
    'quants',
];

// id: true,
// createAt: true,
// archived: true,
// has_fbo_stocks: true,
// has_fbs_stocks: true,
// is_discounted: true,
// offer_id: true,
// product_id: true,
// quants: true

// id                      Int     @id @default(autoincrement()) 
// createAt                DateTime   @default(now())
// updateAt                DateTime   @updatedAt
// // operetions
// operation_id            String
// operation_type          String
// operation_date          String
// operation_type_name     String
// delivery_charge         Int
// return_delivery_charge  Int
// accruals_for_sale       Int
// sale_commission         Int
// amount                  Float
// type                    String
// //delivery schema
// delivery_schema         String?
// order_date              String?
// posting_number          String?
// warehouse_id            String?
// //items
// items                   String?
// //services
// services                String?




// id: true,
// createAt: true,
// dimensionsId: true,
// dimensionsName: true,
// revenue: true,
// ordered_units: true,
// hits_view_search: true,
// hits_view_pdp: true,
// hits_view: true,
// hits_tocart_search: true,
// hits_tocart_pdp: true,
// hits_tocart: true,
// session_view_search: true,
// session_view_pdp: true,
// session_view: true,
// conv_tocart_search: true,
// conv_tocart_pdp: true,
// conv_tocart: true,
// returns: true,
// cancellations: true,
// delivered_units: true,
// position_category: true,

// "revenue",
// "ordered_units",
// "hits_view_search",
// "hits_view_pdp",
// "hits_view",
// "hits_tocart_search",
// "hits_tocart_pdp",
// "hits_tocart",
// "session_view_search",
// "session_view_pdp",
// "session_view",
// "conv_tocart_search",
// "conv_tocart_pdp",
// "conv_tocart",
// "returns",
// "cancellations",
// "delivered_units",
// "position_category",