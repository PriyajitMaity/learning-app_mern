import AdminCourses from "@/components/AdminPortal/courses/AdminCourses";
import AdminDashboard from "@/components/AdminPortal/dashboard/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AdminContext } from "@/context/admin-context";
import { AuthContext } from "@/context/auth-context";
import { fetchCourseList } from "@/services";
import { BarChart, Book, LogOut } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";

const AdminDashboardPage = () => {
    const[activeTab, setActiveTab] =useState('dashboard');
    const{resetCredentials} =useContext(AuthContext);
    const {courseList, setCourseList} =useContext(AdminContext);

    const fetchAllCourses =async() =>{
        const response =await fetchCourseList();
        console.log(response, 'response');
        if(response?.success) setCourseList(response?.data);
        
    }
    useEffect(()=>{
        fetchAllCourses();
    },[]);
    const menuItems =[
        {
            icon: BarChart,
            label: "Dashboard",
            value: "dashboard",
            component: <AdminDashboard />
        },
        {
            icon: Book,
            label: "Courses",
            value: "courses",
            component: <AdminCourses listOfCourses ={courseList} />
        },
        {
            icon: LogOut,
            label: "Logout",
            value: "logout",
            component: null,  // Placeholder for Logout component
        }
    ]
    const handleLogout =() =>{
        resetCredentials();
        sessionStorage.clear();
    }

  return <div className="flex h-full min-h-screen bg-gray-100">
    <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
            <nav>
                {
                 menuItems.map((menuItem) =>(
                    <Button className="w-full mb-2 justify-start" key={menuItem.value}
                     variant={activeTab ===menuItem.value? 'secondary':'ghost'}
                     onClick={menuItem.value ==='logout' ? handleLogout: ()=>setActiveTab(menuItem.value)}
                    >
                        <menuItem.icon className="h-4 w-4 mr-2" key={menuItem.value}/>
                        {menuItem.label}
                    </Button>
                 ))   
                }
            </nav>
        </div>
    </aside>
    <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                {
                    menuItems.map((menuItem) =>(
                        <TabsContent value={menuItem.value}>
                            {menuItem.component !== null ? menuItem.component: null}
                        </TabsContent>
                    ))
                }
            </Tabs>
        </div>
    </main>
  </div>;
};

export default AdminDashboardPage;
