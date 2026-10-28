/**
 * 产品选型（MG 产品库实例）：以 iframe 内嵌 /custom/product-catalog/ 下的
 * 独立页面（products / salespersons / departments）。
 * 页面自身带鉴权与样式；仅当构建开启 VITE_ENABLE_PC_CATALOG 且用户拥有
 * product_catalog 权限（或 admin）时，侧栏才会出现该分组。
 */
export default function PcCatalogPage({ page }: { page: string }) {
  return (
    <iframe
      src={`/custom/product-catalog/${page}.html`}
      title={`product-catalog-${page}`}
      style={{
        border: "none",
        width: "100%",
        height: "calc(100vh - 56px)",
        display: "block",
        backgroundColor: "var(--fn-bg, #f7f6fc)",
      }}
    />
  );
}
