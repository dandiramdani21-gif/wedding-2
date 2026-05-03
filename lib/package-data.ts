export type PackageItemSummary = {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type PackageSummary = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  items: PackageItemSummary[];
  total: number;
};

export function calculatePackageTotal(items: Array<{ totalPrice: number }>) {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function withPackageTotals<
  T extends {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    items: PackageItemSummary[];
  }
>(packages: T[]): Array<T & { total: number }> {
  return packages.map((pkg) => ({
    ...pkg,
    total: calculatePackageTotal(pkg.items)
  }));
}
