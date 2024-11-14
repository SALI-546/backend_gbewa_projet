<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrainingController extends Controller
{
    public function index()
    {
        return view('trainings.create');  // Vue pour afficher la liste des formations
    }
}
