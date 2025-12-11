export function markAsLocked<T extends { isCurrent?: boolean }>(
  items: T[]
): (T & { locked: boolean })[] {
  const currentIndex = items.findIndex((item) => item.isCurrent);
  return items.map((item, idx) => {
    let locked;
    if (currentIndex === -1) {
      // No isCurrent found, only first item unlocked
      locked = idx !== 0;
    } else {
      locked = idx > currentIndex;
    }
    return { ...item, locked };
  });
}
