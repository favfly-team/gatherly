const PageLayout = ({ children, title, description, button }) => {
  return (
    <div className="p-6 w-full space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {button && button}
      </div>
      {children}
    </div>
  );
};

export default PageLayout;
