"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TicketCard = ({ ticket }) => {
  const formattedDate = new Date(ticket.dateTime).toLocaleString();

  return (
    <Card className="bg-zinc-900 text-white shadow-xl rounded-2xl p-4 transition hover:scale-[1.01] hover:shadow-2xl">
      <CardContent className="space-y-2">
        <div className="text-sm text-zinc-400">Ticket #{ticket.ticketNumber}</div>
        <div className="text-2xl font-bold">{ticket.from} → {ticket.to}</div>
        <div className="text-zinc-300">{formattedDate}</div>
        <div className="text-lg text-blue-400 font-semibold">{ticket.price}</div>
      </CardContent>
    </Card>
  );
};

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets"); 
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col items-center gap-6">
      <h1 className="text-white text-4xl font-semibold mb-4">Available Tickets</h1>

      {loading ? (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 bg-zinc-800 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.ticketNumber} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsList;
