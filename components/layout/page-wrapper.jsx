const PageWrapper = ({ children, title, button }) => {
  return (
    <div className="w-full h-full p-6">
      <div className="bg-white border-b -mx-6 -mt-6 mb-6 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h3 className="text-xl font-medium">{title}</h3>
        {button && button}
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
