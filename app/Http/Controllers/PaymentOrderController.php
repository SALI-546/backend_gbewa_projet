<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentOrderController extends Controller
{
    public function index()
    {
        // On renvoie la vue `payments.page` depuis cette fonction
        return view('orderpayment.page2');
    }
}
