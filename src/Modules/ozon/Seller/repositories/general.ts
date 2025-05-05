export class generalForSeller {
     getChangedFields<T>(newItem: any, existingItem: any): Partial<T> {
        const changes: Partial<T> = {};
        Object.keys(newItem).forEach(key => {
          if (newItem[key] !== existingItem[key]) {
            changes[key] = newItem[key];
          }
        });
        return changes;
      }
      
       async executeInBatches<T>(
        items: T[],
        handler: (batch: T[]) => Promise<void>,
        batchSize = 100
      ) {
        for (let i = 0; i < items.length; i += batchSize) {
          await handler(items.slice(i, i + batchSize));
        }
      }
}