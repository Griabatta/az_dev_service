import { PrismaClient } from '@prisma/client';

// todo: Оформить всё как helper

// Функция для конвертации SQL-даты в Date
function parseSqlDateTime(sqlDate: string): Date | null {
    // if (sqlDate instanceof Date) return sqlDate;
    console.log(sqlDate)
    if (!sqlDate) return null;
  
    // Пробуем стандартный парсинг
    const isoDate = sqlDate
      .replace(' ', 'T')  // Преобразуем "2025-03-28 18:11:23.895" → "2025-03-28T18:11:23.895"
  
    const date = new Date(isoDate);
    console.log(date)
    return isNaN(date.getTime()) ? null : date;
  }

interface BatchUpsertOptions<T extends Record<string, any>> {
  prismaModel: {
    findMany: (args: { where: any }) => Promise<T[]>;
    createMany: (args: { data: any[] }) => Promise<{ count: number }>;
    updateMany: (args: { where: any; data: any }) => Promise<{ count: number }>;
  };
  data: T[];
  checkKeys: Array<keyof T>;
  dateFields?: Array<keyof T>; // Поля, которые сравниваем только по дате (без времени)
}

export async function batchUpsert<T extends Record<string, any>>(
  options: BatchUpsertOptions<T>
): Promise<{ createdCount: number; updatedCount: number }> {
  const { prismaModel, data, checkKeys, dateFields = [] } = options;

  if (data.length === 0) {
    return { createdCount: 0, updatedCount: 0 };
  }

  // 1. Формируем условия для поиска дубликатов (сравниваем даты без времени)
  const whereConditions = data.map((item) => ({
    AND: checkKeys.map((key) => {
      const value = item[key];
      
      // Безопасная проверка на дату (без instanceof)
      if (dateFields.includes(key)) {
        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime())) { // Проверяем, что это валидная дата
          const dateOnly = new Date(dateValue);
          dateOnly.setHours(0, 0, 0, 0);
          return { [key]: dateOnly };
        }
      }
      
      return { [key]: value };
    }),
  }));

  // 2. Ищем существующие записи
  const existingRecords = await prismaModel.findMany({
    where: { OR: whereConditions },
  });

  // 3. Разделяем данные на новые и существующие
  const recordsToCreate: T[] = [];
  const recordsToUpdate: Array<{ where: Record<string, any>; data: Partial<T> }> = [];

  data.forEach((item) => {
    // Ищем дубликат (с учетом сравнения дат без времени)
    const duplicate = existingRecords.find((existing) =>
      checkKeys.every((key) => {
        const itemValue = item[key];
        const existingValue = existing[key];

        if (dateFields.includes(key)) {
            const itemDate = itemValue;
            const existingDate = existingValue;
            if (!itemDate || !existingDate) return false;
            
            return (
              itemDate.toISOString().slice(0, 10) === 
              existingDate.toISOString().slice(0, 10)
            );
          }

        // Для остальных полей — обычное сравнение
        return existingValue === itemValue;
      })
    );

    if (!duplicate) {
      // Новая запись
      recordsToCreate.push(item);
    } else {
      // Запись для обновления (исключаем checkKeys)
      const updateData: Partial<T> = {};
      for (const key in item) {
        if (!checkKeys.includes(key as keyof T)) {
          updateData[key as keyof T] = item[key];
        }
      }

      if (Object.keys(updateData).length > 0) {
        // Формируем условие WHERE для обновления
        const where = Object.fromEntries(
          checkKeys.map((key) => [key, item[key]])
        );
        recordsToUpdate.push({ where, data: updateData });
      }
    }
  });

  // 4. Выполняем операции
  let createdCount = 0;
  let updatedCount = 0;

  // Создаем новые записи
  if (recordsToCreate.length > 0) {
    const result = await prismaModel.createMany({ data: recordsToCreate });
    createdCount = result.count;
  }

  // Обновляем существующие (группируем по одинаковым WHERE)
  if (recordsToUpdate.length > 0) {
    const updatesGrouped = new Map<string, { where: any; data: Partial<T> }>();

    recordsToUpdate.forEach(({ where, data }) => {
      const whereKey = JSON.stringify(where);
      if (!updatesGrouped.has(whereKey)) {
        updatesGrouped.set(whereKey, { where, data: {} as Partial<T> });
      }
      Object.assign(updatesGrouped.get(whereKey)!.data, data);
    });

    // Применяем updateMany для каждой группы
    for (const { where, data } of updatesGrouped.values()) {
      const result = await prismaModel.updateMany({ where, data });
      updatedCount += result.count;
    }
  }

  return { createdCount, updatedCount };
}