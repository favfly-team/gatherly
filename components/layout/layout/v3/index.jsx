import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Layout = ({ children }) => {
  return (
    <Tabs defaultValue="flows" className="flex flex-col bg-white w-full h-full">
      <Header />

      <div className="w-full h-full p-4">{children}</div>
    </Tabs>
  );
};

const Header = () => {
  const tabs = [
    {
      value: "flows",
      label: "Flows",
    },
    {
      value: "playground",
      label: "Playground",
    },
    {
      value: "settings",
      label: "Settings",
    },
  ];

  return (
    <TabsList className="w-full bg-white border-b rounded-none h-12 shrink-0">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="data-[state=active]:shadow-none data-[state=active]:hover:bg-muted hover:bg-muted relative before:content-none data-[state=active]:before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-primary before:-bottom-[10px] before:left-0"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default Layout;
