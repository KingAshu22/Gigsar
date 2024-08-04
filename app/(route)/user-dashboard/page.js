"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";
import withAuth from "@/lib/withAuth";

function UserDashboard() {
  const router = useRouter();

  const [contact, setContact] = useState("" || localStorage?.getItem("mobile"));
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contact) {
      getClient();
    }
  }, [contact]);

  const getClient = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/client/contact/+${contact}`
      );

      if (response.data) {
        setClient(response.data);
      } else {
        router.push("/user-dashboard/registration");
      }
    } catch (error) {
      console.error("Error fetching Client:", error);
      router.push("/user-dashboard/registration");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#dc2626" size={80} />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-5">
        Welcome, <span className="text-primary">{client?.name} 👋</span>
      </h1>
      <Separator className="bg-gray-400 my-5" />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        <Link href="/chat">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center">
              <MessageSquare className="hidden sm:block" />
              <div className="ml-0 sm:ml-4 mt-2 sm:mt-0">
                <CardTitle>Chat</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="mt-2 sm:mt-4">
              <p>Chat with Artists</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default withAuth(UserDashboard);
