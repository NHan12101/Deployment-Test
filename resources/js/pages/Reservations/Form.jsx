import React from "react";
import { useForm, Link, usePage } from "@inertiajs/react";

export default function Form({ reservation }) {
    const { flash } = usePage().props;

    const { data, setData, post, put, processing, errors } = useForm({
        customer_name: reservation?.customer_name || "",
        phone: reservation?.phone || "",
        party_size: reservation?.party_size || 1,
        reserved_at: reservation?.reserved_at
            ? reservation.reserved_at.substring(0, 16)
            : "",
        status: reservation?.status || "pending",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reservation) {
            put(`/reservations/${reservation.id}`);
        } else {
            post("/reservations");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                {reservation ? "Edit Reservation" : "New Reservation"}
            </h1>

            {flash?.success && (
                <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Customer Name */}
                <div>
                    <label className="block font-medium">Customer Name</label>
                    <input
                        type="text"
                        value={data.customer_name}
                        onChange={(e) => setData("customer_name", e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.customer_name && (
                        <div className="text-red-500 text-sm">
                            {errors.customer_name}
                        </div>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.phone && (
                        <div className="text-red-500 text-sm">{errors.phone}</div>
                    )}
                </div>

                {/* Party Size */}
                <div>
                    <label className="block font-medium">Party Size</label>
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={data.party_size}
                        onChange={(e) => setData("party_size", e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.party_size && (
                        <div className="text-red-500 text-sm">{errors.party_size}</div>
                    )}
                </div>

                {/* Reserved At */}
                <div>
                    <label className="block font-medium">Reserved At</label>
                    <input
                        type="datetime-local"
                        value={data.reserved_at}
                        onChange={(e) => setData("reserved_at", e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    {errors.reserved_at && (
                        <div className="text-red-500 text-sm">{errors.reserved_at}</div>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="block font-medium">Status</label>
                    <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="seated">Seated</option>
                        <option value="canceled">Canceled</option>
                    </select>
                    {errors.status && (
                        <div className="text-red-500 text-sm">{errors.status}</div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                    <Link
                        href="/reservations"
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Back
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {reservation ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
