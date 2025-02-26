<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    private $apiBaseUrl = "http://localhost:1000/api/users";

    // ✅ GET ALL USERS
    public function index()
    {
        $response = Http::get($this->apiBaseUrl);
        $users = $response->json();

        return view('users.index', [
            'users' => $users['data']['users'] ?? []
        ]);
    }

    // ✅ SHOW FORM CREATE USER
    public function create()
    {
        return view('users.create');
    }

    // ✅ STORE NEW USER
    public function store(Request $request)
    {
        $fotoProfile = null;

        if ($request->hasFile('foto_profile')) {
            $file = $request->file('foto_profile');

            if ($file->isValid()) {
                $fotoProfile = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('uploads'), $fotoProfile);
            } else {
                return redirect()->back()->with('error', 'File gambar tidak valid.');
            }
        }

        $response = Http::post($this->apiBaseUrl, [
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'foto_profile' => $fotoProfile
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan');
    }

    // ✅ SHOW FORM EDIT USER
    public function edit($id)
    {
        $response = Http::get("{$this->apiBaseUrl}/{$id}");
        $data = $response->json();

        Log::info('Response from API:', $data);

        if (isset($data['data'])) {
            return view('users.edit', ['user' => $data['data']]);
        } else {
            return redirect()->route('users.index')->with('error', 'User tidak ditemukan');
        }
    }

    // UPDATE USER
    public function update(Request $request, $id)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];
    
        if ($request->password) {
            $data['password'] = $request->password;
        }
    
        if ($request->hasFile('foto_profile')) {
            $file = $request->file('foto_profile');
    
            if ($file->isValid()) {
                $fotoProfile = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->getRealPath();
    
                Log::info('File path:', ['path' => $filePath]);
    
                if (file_exists($filePath)) {
                    $response = Http::attach(
                        'foto_profile',
                        file_get_contents($filePath),
                        $file->getClientOriginalName()
                    )->put("{$this->apiBaseUrl}/{$id}", array_merge($data, ['foto_profile' => $fotoProfile]));
                } else {
                    Log::error('File does not exist at path:', ['path' => $filePath]);
                    return redirect()->back()->with('error', 'File gambar tidak valid.');
                }
            } else {
                return redirect()->back()->with('error', 'File gambar tidak valid.');
            }
        } else {
            // Jika tidak ada file yang diupload, kirim tanpa file
            $response = Http::put("{$this->apiBaseUrl}/{$id}", $data);
        }
    
        if ($response->failed()) {
            Log::error('Failed to update user:', ['response' => $response->json()]);
            return redirect()->back()->with('error', 'Gagal memperbarui user.');
        }
    
        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui');
    }

    // ✅ DELETE USER
    public function destroy($id)
    {
        Http::delete("{$this->apiBaseUrl}/{$id}");

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus');
    }
}
