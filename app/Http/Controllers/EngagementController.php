<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EngagementController extends Controller
{
    public function index()
    {
        return view('engagement.index');
    }
}
