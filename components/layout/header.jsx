import Breadcrumb from "./breadcrumb";

const Header = () => {
  return (
    <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
      {/* // ====== BREADCRUMB ====== */}
      <Breadcrumb />
    </header>
  );
};

export default Header;
