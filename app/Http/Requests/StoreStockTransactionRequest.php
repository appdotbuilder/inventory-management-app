<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'item_id' => 'required|exists:items,id',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'supplier' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'item_id.required' => 'Barang harus dipilih.',
            'item_id.exists' => 'Barang tidak ditemukan.',
            'type.required' => 'Jenis transaksi harus dipilih.',
            'type.in' => 'Jenis transaksi tidak valid.',
            'quantity.required' => 'Jumlah harus diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'transaction_date.required' => 'Tanggal transaksi harus diisi.',
            'transaction_date.date' => 'Format tanggal tidak valid.',
        ];
    }
}