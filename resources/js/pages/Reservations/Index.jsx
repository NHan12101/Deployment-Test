import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function Index() {
    const { reservations, filters, flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this reservation?")) {
            router.delete(`/reservations/${id}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get("/reservations", {
            search: formData.get("search"),
            status: formData.get("status"),
        });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Reservations</h1>

            {flash?.success && (
                <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
                    {flash.success}
                </div>
            )}

            {/* Search + Filter */}
            <form
                onSubmit={handleSearch}
                className="flex gap-2 mb-4 items-center"
            >
                <input
                    type="text"
                    name="search"
                    defaultValue={filters?.search || ""}
                    placeholder="Search name or phone..."
                    className="border p-2 rounded flex-1"
                />
                <select
                    name="status"
                    defaultValue={filters?.status || ""}
                    className="border p-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated</option>
                    <option value="canceled">Canceled</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Filter
                </button>
                <Link
                    href="/reservations/create"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    New
                </Link>
            </form>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Party Size</th>
                            <th className="border p-2">Reserved At</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.data.length > 0 ? (
                            reservations.data.map((r) => (
                                <tr key={r.id}>
                                    <td className="border p-2">
                                        {r.customer_name}
                                    </td>
                                    <td className="border p-2">{r.phone}</td>
                                    <td className="border p-2">{r.party_size}</td>
                                    <td className="border p-2">
                                        {new Date(r.reserved_at).toLocaleString()}
                                    </td>
                                    <td className="border p-2 capitalize">
                                        {r.status}
                                    </td>
                                    <td className="border p-2 flex gap-2">
                                        <Link
                                            href={`/reservations/${r.id}/edit`}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="border p-2 text-center text-gray-500"
                                >
                                    No reservations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex gap-2">
                {reservations.links.map((link, i) => (
                    <button
                        key={i}
                        disabled={!link.url}
                        onClick={() => router.get(link.url)}
                        className={`px-3 py-1 border rounded ${
                            link.active ? "bg-blue-500 text-white" : ""
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
