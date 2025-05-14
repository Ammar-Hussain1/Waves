"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "../utilis/auth";
import Loader from "@/components/loader";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlaneDeparture, FaTicketAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

const API = {
    bookings: 'http://localhost:8080/api/refunds/getAllBookings',
    applyRefund: 'http://localhost:8080/api/refunds/applyRefund',
    refundStatuses: 'http://localhost:8080/api/refunds/user-refund-status',
};

const tabVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
};

const notificationVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15, stiffness: 100 } },
    exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } },
};

function BookingsPage() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [refundStatus, setRefundStatus] = useState([]);
    const [previousRefunds, setPreviousRefunds] = useState([]);
    const [refundInput, setRefundInput] = useState({ bookingId: '', reason: '' });
    const [showNotification, setShowNotification] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push(`/signup?redirect=${encodeURIComponent(pathname)}`);
            } else {
                setAuthChecked(true);
            }
        }
    }, [user, loading, router, pathname]);

    useEffect(() => {
        if (!user) return;

        const fetchBookings = async () => {
            try {
                const res = await fetch(API.bookings, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ UserID: user?.UserID }),
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setBookings(data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setShowNotification({ type: 'error', message: 'Failed to fetch bookings.' });
                setTimeout(() => setShowNotification(null), 3000);
            }
        };

        const fetchRefundStatuses = async () => {
            try {
                const res = await fetch(API.refundStatuses, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ UserID: user?.UserID }),
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                if (JSON.stringify(previousRefunds) !== JSON.stringify(data)) {
                    setShowNotification({ type: 'success', message: 'Refund status updated!' });
                    setTimeout(() => setShowNotification(null), 3000);
                }
                setPreviousRefunds(data);
                setRefundStatus(data);
            } catch (err) {
                console.error("Error fetching refund statuses:", err);
                setShowNotification({ type: 'error', message: 'Failed to fetch refund statuses.' });
                setTimeout(() => setShowNotification(null), 3000);
            }
        };

        if (activeTab === 'bookings') {
            fetchBookings();
        }

        if (activeTab === 'refund-status') {
            fetchRefundStatuses();
        }
    }, [activeTab, user, previousRefunds]);

    const handleRefund = async (e) => {
        e.preventDefault();
        if (!user?.UserID) {
            setShowNotification({ type: 'warning', message: 'User not authenticated.' });
            setTimeout(() => setShowNotification(null), 3000);
            return;
        }

        try {
            const res = await fetch(API.applyRefund, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    BookingNumber: refundInput.bookingId,
                    Reason: refundInput.reason,
                    UserID: user.UserID,
                }),
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setShowNotification({ type: 'success', message: 'Refund Request Submitted!' });
            setTimeout(() => setShowNotification(null), 3000);
            setRefundInput({ bookingId: '', reason: '' });
        } catch (err) {
            console.error("Error applying refund:", err);
            setShowNotification({ type: 'error', message: 'Refund request failed.' });
            setTimeout(() => setShowNotification(null), 3000);
        }
    };

    const tabButton = (tabName, label, icon) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center space-x-2 px-4 py-3 text-white ${activeTab === tabName ? 'bg-gray-700 shadow-md' : 'bg-zinc-900 hover:bg-gray-700'} rounded-md transition duration-300`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    if (!authChecked) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
                <Loader />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-zinc-950 text-white p-8 font-sans"
        >
            <div className="container mx-auto">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-extralight mb-8 text-center text-gray-400"
                >
                    <FaPlaneDeparture className="inline-block mr-2 mb-1" /> Flight Dashboard
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex space-x-4 mb-8 justify-center"
                >
                    {tabButton('bookings', 'Bookings', <FaTicketAlt />)}
                    {tabButton('apply-refund', 'Apply Refund', <FaMoneyBillWave />)}
                    {tabButton('refund-status', 'Refund Status', <FaCheckCircle />)}
                </motion.div>

                <AnimatePresence>
                    {activeTab === 'bookings' && (
                        <motion.div
                            key="bookings"
                            variants={tabVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h2 className="text-xl font-extralight mb-4 text-gray-300">Your Bookings</h2>
                            <div className="overflow-x-auto rounded-lg shadow-md">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-900 text-gray-200">
                                        <tr>
                                            <th className="py-3 px-4">Booking Number</th>
                                            <th className="py-3 px-4">Flight Number</th>
                                            <th className="py-3 px-4">From</th>
                                            <th className="py-3 px-4">To</th>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-zinc-950 text-gray-300">
                                        {Array.isArray(bookings) && bookings.map((b, idx) => (
                                            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-850' : ''}`}>
                                                <td className="py-3 px-4">{b.BookingNumber}</td>
                                                <td className="py-3 px-4">{b.FlightNumber}</td>
                                                <td className="py-3 px-4">{b.DepartureAirport}</td>
                                                <td className="py-3 px-4">{b.ArrivalAirport}</td>
                                                <td className="py-3 px-4">{new Date(b.BookingDate).toLocaleDateString()}</td>
                                                <td className="py-3 px-4">{b.Status}</td>
                                            </tr>
                                        ))}
                                        {Array.isArray(bookings) && bookings.length === 0 && (
                                            <tr>
                                                <td className="py-6 text-center" colSpan="6">No bookings found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'apply-refund' && (
                        <motion.div
                            key="apply-refund"
                            variants={tabVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="max-w-md mx-auto mt-8 p-6 bg-zinc-900 rounded-lg shadow-md"
                        >
                            <h2 className="text-xl font-extralight mb-6 text-gray-300">Apply for Refund</h2>
                            <form onSubmit={handleRefund} className="space-y-4">
                                <div>
                                    <label htmlFor="bookingId" className="block text-gray-400 text-sm font-extralight mb-2">
                                        Booking Number:
                                    </label>
                                    <input
                                        type="text"
                                        id="bookingId"
                                        placeholder="Enter booking number"
                                        value={refundInput.bookingId}
                                        onChange={(e) => setRefundInput({ ...refundInput, bookingId: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="reason" className="block text-gray-400 text-sm font-extralight mb-2">
                                        Reason for refund:
                                    </label>
                                    <textarea
                                        id="reason"
                                        placeholder="Explain why you need a refund"
                                        value={refundInput.reason}
                                        onChange={(e) => setRefundInput({ ...refundInput, reason: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                                        required
                                        rows="4"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-extralight py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full"
                                >
                                    Submit Refund Request
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'refund-status' && (
                        <motion.div
                            key="refund-status"
                            variants={tabVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h2 className="text-xl font-extralight mb-4 text-gray-300">Refund Statuses</h2>
                            <ul className="space-y-4">
                                {Array.isArray(refundStatus) && refundStatus.map((r, idx) => (
                                    <motion.li
                                        key={idx}
                                        className="bg-zinc-900 p-6 rounded-lg shadow-md border border-gray-700"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                                    >
                                        <div className="mb-2"><strong className="text-gray-400">Booking Number:</strong> <span className="text-gray-300">{r.BookingNumber}</span></div>
                                        <div className="mb-2"><strong className="text-gray-400">Status:</strong> <span className={`${r.RefundStatus === 'Approved' ? 'text-green-400' : r.RefundStatus === 'Pending' ? 'text-yellow-400' : 'text-red-400'}`}>{r.RefundStatus}</span></div>
                                        <div className="mb-2"><strong className="text-gray-400">Reason:</strong> <span className="text-gray-300">{r.Reason}</span></div>
                                        {r.RefundAmount !== null && (
                                            <div><strong className="text-gray-400">Refund Amount:</strong> <span className="text-green-400">${r.RefundAmount?.toFixed(2)}</span></div>
                                        )}
                                        {r.RefundAmount === null && (
                                            <div><strong className="text-gray-400">Refund Amount:</strong> <span className="text-gray-300">N/A</span></div>
                                        )}
                                    </motion.li>
                                ))}
                                {Array.isArray(refundStatus) && refundStatus.length === 0 && (
                                    <li className="py-6 text-center text-gray-500">No refund statuses available.</li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showNotification && (
                        <motion.div
                            className={`fixed bottom-6 right-6 bg-${showNotification.type === 'success' ? 'green' : showNotification.type === 'error' ? 'red' : 'yellow'}-600 text-white px-4 py-3 rounded-md shadow-lg`}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={notificationVariants}
                            transition={{ duration: 0.3 }}
                        >
                            {showNotification.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default BookingsPage;