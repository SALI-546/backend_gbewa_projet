<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function show()
    {
        return view('request.show');  // Vue pour afficher le RequestList
    }
}
