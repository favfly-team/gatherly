"use client";

// import {
//   Tabs,
//   TabsContent as TabsContentComponent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
import TeamManagement from "./team-management";

const TeamMain = () => {
  // const tabs = [
  //   {
  //     label: "Team Members",
  //     value: "team-members",
  //   },
  //   // {
  //   //   label: "Lead Assignment",
  //   //   value: "lead-assignment",
  //   // },
  // ];

  return (
    <TeamManagement />
    // <Tabs defaultValue={tabs[0].value} className="w-full">
    //   <TabsHeader tabs={tabs} />

    //   {tabs.map((tab) => (
    //     <TabsContent key={tab.value} tab={tab} />
    //   ))}
    // </Tabs>
  );
};

// const TabsHeader = ({ tabs }) => {
//   return (
//     <TabsList>
//       {tabs.map((tab) => (
//         <TabsTrigger key={tab.value} value={tab.value}>
//           {tab.label}
//         </TabsTrigger>
//       ))}
//     </TabsList>
//   );
// };

// const TabsContent = ({ tab }) => {
//   return (
//     <TabsContentComponent value={tab.value}>
//       {tab.value === "team-members" && <TeamManagement />}
//     </TabsContentComponent>
//   );
// };

export default TeamMain;
