<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentRequestController extends Controller
{
    public function index()
    {
        // On renvoie la vue `payments.page` depuis cette fonction
        return view('payments.page');
    }
}
