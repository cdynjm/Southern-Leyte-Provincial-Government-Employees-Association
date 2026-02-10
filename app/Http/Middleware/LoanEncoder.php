<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LoanEncoder
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(auth()->user()->role !== "employee" || auth()->user()->specialAccount !== "Loan Encoder") {
            return redirect('/')->with('error', 'You do not have special account access.');
        }

        return $next($request);
    }
}
