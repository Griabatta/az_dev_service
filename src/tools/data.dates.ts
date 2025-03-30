



export function MounthBack(date: Date = new Date()) {
    const date_from = new Date(date.setMonth(date.getMonth() - 1)).toISOString().slice(0, 10); // За последний месяц
    return date_from;
}

export function dateFormatFetch(date: Date = new Date()) {
    const date_to = date.toISOString().slice(0, 10);
    return date_to;
}