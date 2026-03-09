// src/Pages/Dashboard/RiderDashboard/RiderEarnings.jsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    FaMoneyBill,
    FaCalendarAlt,
    FaHistory,
    FaWallet,
    FaDownload,
    FaArrowUp
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../ErrorPage/Loading';


const RiderEarnings = () => {
    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();
    const [period, setPeriod] = useState('month');

    // Fetch earnings data
    const { data: earnings = {}, isLoading: earningsLoading, refetch } = useQuery({
        queryKey: ['rider-earnings', user?.uid, period],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/earnings?riderId=${user?.uid}&period=${period}`);
            return res.data.data || {};
        },
        enabled: !!user?.uid
    });

    // Fetch transaction history
    const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
        queryKey: ['rider-transactions', user?.uid],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/transactions?riderId=${user?.uid}`);
            return res.data.data || [];
        },
        enabled: !!user?.uid
    });

    // Cashout mutation
    const cashoutMutation = useMutation({
        mutationFn: (amount) =>
            axiosSecure.post('/rider/cashout', {
                riderId: user?.uid,
                amount,
                method: 'bkash' // You can make this dynamic
            }),
        onSuccess: () => {
            refetch();
            Swal.fire({
                icon: 'success',
                title: 'Cashout Request Submitted!',
                text: 'Your request is being processed. You will receive the money within 24 hours.',
                confirmButtonColor: '#3b82f6'
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Cashout Failed',
                text: error.response?.data?.message || 'Failed to process cashout request',
                confirmButtonColor: '#3b82f6'
            });
        }
    });

    const handleCashout = () => {
        if (!earnings.availableBalance || earnings.availableBalance < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Insufficient Balance',
                text: 'Minimum cashout amount is $10',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        Swal.fire({
            title: 'Cashout Request',
            html: `
                <div class="text-left">
                    <p class="mb-3">Available Balance: <strong class="text-green-600">$${earnings.availableBalance}</strong></p>
                    
                    <div class="form-control mb-3">
                        <label class="label">
                            <span class="label-text">Select Payment Method</span>
                        </label>
                        <select id="paymentMethod" class="select select-bordered w-full">
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Enter Amount ($)</span>
                        </label>
                        <input type="number" id="cashoutAmount" class="input input-bordered" 
                               min="10" max="${earnings.availableBalance}" step="10" value="10">
                    </div>
                    
                    <div class="form-control mt-3">
                        <label class="label">
                            <span class="label-text">Account Number</span>
                        </label>
                        <input type="text" id="accountNumber" class="input input-bordered" 
                               placeholder="Enter your ${'selectedMethod'} number">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Request Cashout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3b82f6',
            preConfirm: () => {
                const method = document.getElementById('paymentMethod').value;
                const amount = document.getElementById('cashoutAmount').value;
                const account = document.getElementById('accountNumber').value;

                if (!amount || amount < 10) {
                    Swal.showValidationMessage('Amount must be at least $10');
                    return false;
                }
                if (amount > earnings.availableBalance) {
                    Swal.showValidationMessage('Insufficient balance');
                    return false;
                }
                if (!account) {
                    Swal.showValidationMessage('Please enter your account number');
                    return false;
                }
                return { amount: parseFloat(amount), method, account };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                cashoutMutation.mutate(result.value.amount);
            }
        });
    };

    if (earningsLoading || transactionsLoading) {
        return <Loading />;
    }

    const periodLabels = {
        week: 'This Week',
        month: 'This Month',
        year: 'This Year',
        all: 'All Time'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <FaMoneyBill className="text-primary" />
                My Earnings
            </h1>

            {/* Period Filter */}
            <div className="flex gap-2">
                {['week', 'month', 'year', 'all'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">${earnings.total || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">{periodLabels[period]}</p>
                    <p className="text-2xl font-bold text-blue-600">${earnings.periodTotal || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">${earnings.pending || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Withdrawn</p>
                    <p className="text-2xl font-bold text-purple-600">${earnings.withdrawn || 0}</p>
                </div>
            </div>

            {/* Available Balance & Cashout */}
            <div className="bg-linear-to-r from-primary to-secondary rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90">Available Balance</p>
                        <p className="text-3xl font-bold">${earnings.availableBalance || 0}</p>
                        <p className="text-xs opacity-75 mt-1">Minimum cashout: $10</p>
                    </div>
                    <button
                        onClick={handleCashout}
                        disabled={!earnings.availableBalance || earnings.availableBalance < 10 || cashoutMutation.isPending}
                        className="btn bg-white text-primary hover:bg-gray-100 border-0"
                    >
                        {cashoutMutation.isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FaArrowUp className="mr-2" />
                                Cashout Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Delivery Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Deliveries Completed</p>
                    <p className="text-2xl font-bold text-green-600">{earnings.deliveryCount || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Average per Delivery</p>
                    <p className="text-2xl font-bold text-orange-600">${earnings.averagePerDelivery || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">This Week's Deliveries</p>
                    <p className="text-2xl font-bold text-blue-600">{earnings.weeklyDeliveries || 0}</p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaHistory className="text-primary" />
                        Transaction History
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx._id}>
                                        <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${tx.type === 'earning' ? 'badge-success' :
                                                    tx.type === 'withdrawal' ? 'badge-info' :
                                                        'badge-ghost'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td>{tx.description}</td>
                                        <td className="font-semibold">
                                            {tx.type === 'earning' ? '+' : '-'}${Math.abs(tx.amount)}
                                        </td>
                                        <td>
                                            <span className={`badge ${tx.status === 'completed' ? 'badge-success' :
                                                    tx.status === 'pending' ? 'badge-warning' :
                                                        'badge-error'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Earnings Chart Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <FaMoneyBill className="text-4xl mx-auto mb-2 opacity-50" />
                        <p>Chart visualization will be here</p>
                        <p className="text-sm">(You can integrate Recharts or any chart library)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderEarnings;