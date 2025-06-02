const Layout = ({ children, title, button }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <Header title={title} button={button} />
      <div className="w-full h-full p-4">{children}</div>
    </div>
  );
};

const Header = ({ title, button }) => {
  return (
    <div className="border-b border-gray-200 bg-white w-full px-4 py-2 flex items-center justify-between">
      <span className="text-lg font-medium">{title}</span>
      {button}
    </div>
  );
};

export default Layout;
