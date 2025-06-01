const AuthLayout = ({ children }) => {
  return (
    <div className="bg-accent flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {children}
    </div>
  );
};

export default AuthLayout;
