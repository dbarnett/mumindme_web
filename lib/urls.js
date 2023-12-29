/**
 * Applies updated search params and returns.
 *
 * Note it will guarantee it returns *the same instance* if there were no
 * actual updates performed, so you can use instance equality (===) to shortcut
 * other related operations.
 */
export function updateSearchParams(searchParams, newParams) {
  const params = new URLSearchParams(searchParams);
  let didUpdate = false;
  Object.entries(newParams).forEach(([key, value]) => {
    if (searchParams.get(key) != value) {
      didUpdate = true;
      params.set(key, value);
    }
  });
  return didUpdate ? params : searchParams;
}
