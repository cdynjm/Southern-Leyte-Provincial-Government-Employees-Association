<?php 
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdminPermission
{
    public function handle(Request $request, Closure $next, $page)
    {
        $user = auth()->user();

        $hasPermission = $user->adminpermissions()
            ->whereHas('permission', function ($query) use ($page) {
                $query->where('pages', $page);
            })
            ->exists();

        if (!$hasPermission) {
            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}