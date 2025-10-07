<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    // Danh sách Reservation
    public function index(Request $request)
    {
        $query = Reservation::query();

        // Filter search theo tên hoặc phone
        if ($request->search) {
            $query->where('customer_name', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%");
        }

        // Filter theo status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $reservations = $query->orderBy('reserved_at', 'desc')->paginate(10);

        return Inertia::render('Reservations/Index', [
            'reservations' => $reservations,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    // Trang tạo mới
    public function create()
    {
        return Inertia::render('Reservations/Form');
    }

    // Lưu dữ liệu mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'phone' => ['required','regex:/^\+?\d{8,15}$/'],
            'party_size' => 'required|integer|min:1|max:50',
            'reserved_at' => 'required|date|after_or_equal:now',
            'status' => 'required|in:pending,confirmed,seated,canceled',
        ]);

        Reservation::create($validated);

        return redirect()->route('reservations.index')->with('success', 'Reservation created successfully.');
    }

    // Trang chỉnh sửa
    public function edit(Reservation $reservation)
    {
        return Inertia::render('Reservations/Form', [
            'reservation' => $reservation
        ]);
    }

    // Cập nhật dữ liệu
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'phone' => ['required','regex:/^\+?\d{8,15}$/'],
            'party_size' => 'required|integer|min:1|max:50',
            'reserved_at' => 'required|date|after_or_equal:now',
            'status' => 'required|in:pending,confirmed,seated,canceled',
        ]);

        $reservation->update($validated);

        return redirect()->route('reservations.index')->with('success', 'Reservation updated successfully.');
    }

    // Xóa dữ liệu
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return redirect()->route('reservations.index')->with('success', 'Reservation deleted successfully.');
    }
}
