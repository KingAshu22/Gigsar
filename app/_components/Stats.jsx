import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Mic } from "lucide-react";

const Stats = () => {
  const [artists, setArtists] = useState(2218);
  const [clients, setClients] = useState(0);

  useEffect(() => {
    // Fetching artist and client counts from API
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setArtists(data.artists);
        setClients(data.clients);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center py-10">
      <Card className="w-72 shadow-lg rounded-2xl p-6 bg-white dark:bg-gray-900 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Mic size={40} className="text-blue-500" />
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {artists}+
          </motion.h2>
          <p className="text-gray-500">Total Artists</p>
        </CardContent>
      </Card>
      <Card className="w-72 shadow-lg rounded-2xl p-6 bg-white dark:bg-gray-900 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Users size={40} className="text-green-500" />
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {clients}+
          </motion.h2>
          <p className="text-gray-500">Total Clients</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
