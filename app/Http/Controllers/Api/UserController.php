<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    // Récupérer tous les utilisateurs
    public function index()
    {
        $users = User::select('id', 'name')->get();

        return response()->json($users);
    }
}
