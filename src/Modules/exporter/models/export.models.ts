// TODO: Exporter ни должен ничего знать о структуре данных! Нужно переделать его так чтобы он принимал только голые данные для одного листа


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
